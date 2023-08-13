import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../common/shared/logger';
import { retrieveTransactionsRepository } from '../repository/transaction.repository';
import { PaginationArgs } from '../../../common/shared/types';
import { TransactionType } from '../enums';
import { UpdateBalanceProps } from '../types';
import {
  findAccountByIdRepository,
  findAccountNumberRepository,
  updateSenderAndReceiverBalanceAndCreateTransaction,
} from '../../account/repository/account.repository';
export const fetchTransactions = async (req: Request, res: Response) => {
  const { type, limit, offset } = req.query;
  const filterInput = type ? { type: type.toString() as TransactionType } : undefined;
  const paginationArgs = { limit, offset } as unknown as PaginationArgs;

  try {
    const transactions = await retrieveTransactionsRepository(paginationArgs, filterInput);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Transactions fetched successfully',
      data: transactions,
    });
  } catch (error: any) {
    logger.error('fetchTransactions failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const transferFund = async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const { accountNumber, amount, message } = req.body;

  try {
    const receiver = await findAccountNumberRepository(accountNumber);

    if (!receiver) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: `Receiver account number doesn't exit`,
        data: null,
      });
    }

    const sender = await findAccountByIdRepository(accountId);

    if (!sender) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Invalid account id.',
        data: null,
      });
    }

    if (amount > sender.balance) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        status: false,
        message: 'Insufficient balance',
        data: null,
      });
    }

    const props: UpdateBalanceProps = {
      senderBalance: sender.balance,
      accountNumber,
      amount,
      accountId,
      receiverBalance: receiver.balance,
      message,
    };

    const senderAccount = await updateSenderAndReceiverBalanceAndCreateTransaction(props);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Amount was transferred successfully',
      data: senderAccount,
    });
  } catch (error: any) {
    logger.error('transferFund failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};
