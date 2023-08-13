import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../common/shared/logger';
import { generateAccountNumber } from '../../../common/utils';
import { retrieveAccountRepository, fetchCompanyAndAccountRepository, findAccountByIdRepository } from '../repository/account.repository';

export const createAccount = async (req: Request, res: Response) => {
  const { companyId } = req.body;

  try {
    const { company, accountRepository } = await fetchCompanyAndAccountRepository(companyId);

    const acctNumber = await generateAccountNumber();

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'CompanyId not found.',
        data: null,
      });
    }

    const newAccount = accountRepository.create({
      accountNumber: acctNumber,
      company,
      createdBy: companyId,
    });

    await accountRepository.save(newAccount);

    return res.status(StatusCodes.CREATED).send({
      status: true,
      message: 'Account created successfully',
      data: newAccount,
    });
  } catch (error: any) {
    logger.error('createAccount failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const getAccountById = async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const { searchText } = req.query;
  const searchInput = searchText ? { searchText: searchText.toString() } : undefined;

  try {
    const acct = await findAccountByIdRepository(accountId);

    if (!acct) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Account not found.',
        data: null,
      });
    }

    const account = await retrieveAccountRepository(accountId, searchInput);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Account fetched successfully',
      data: account,
    });
  } catch (error: any) {
    logger.error('getAccountById failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};
