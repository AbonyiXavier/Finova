import { getConnection, getRepository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { FetchResult } from '../types';
import logger from '../../../common/shared/logger';
import { findCompanyByIdRepository } from '../../company/repository/company.repository';
import { SearchByInput } from '../../../common/shared/types';
import { UpdateBalanceProps } from '../../transaction/types';
import { createTransactionRepository } from '../../transaction/repository/transaction.repository';
import { TransactionStatus, TransactionType } from '../../transaction/enums';

export const fetchCompanyAndAccountRepository = async (companyId: string): Promise<FetchResult> => {
  try {
    const accountRepository = getRepository(Account);
    const company = await findCompanyByIdRepository(companyId);

    return { company, accountRepository };
  } catch (error) {
    logger.error('fetchCompanyAndAccountRepository failed', error);
    throw error;
  }
};

export const findAccountByIdRepository = async (accountId: string): Promise<Account | undefined> => {
  try {
    const accountRepository = getRepository(Account);

    const account = await accountRepository.findOne({
      where: { id: accountId },
    });

    return account;
  } catch (error) {
    logger.error('findAccountByIdRepository failed', error);
    throw error;
  }
};

export const checkExistingAccountNumberRepository = async (accountNumber: string): Promise<Account | undefined> => {
  try {
    const accountRepository = getRepository(Account);

    const existingAccount = await accountRepository.findOne({
      where: { accountNumber },
    });

    return existingAccount;
  } catch (error) {
    logger.error('checkExistingAccountNumberRepository failed', error);
    throw error;
  }
};

export const retrieveAccountRepository = async (accountId: string, searchInput?: SearchByInput): Promise<Account | undefined> => {
  try {
    const accountRepository = getRepository(Account);

    const query = accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.company', 'company')
      .leftJoinAndSelect('account.cards', 'cards')
      .leftJoinAndSelect('account.transactions', 'transactions');

    if (searchInput?.searchText) {
      query.where('account.accountNumber = :searchText', {
        searchText: searchInput.searchText,
      });

      // Search for cardNumber within the cards array
      query.orWhere('cards.cardNumber = :searchText', {
        searchText: searchInput.searchText,
      });
    }

    query.andWhere('account.id = :accountId', { accountId });

    const account = await query.getOne();

    return account;
  } catch (error) {
    logger.error('retrieveAccountRepository failed', error);
    throw error;
  }
};

export const findAccountNumberRepository = async (accountNumber: string): Promise<Account | undefined> => {
  try {
    const accountRepository = getRepository(Account);

    const account = await accountRepository.findOne({
      where: { accountNumber },
    });

    return account;
  } catch (error) {
    logger.error('findAccountNumberRepository failed', error);
    throw error;
  }
};

export const updateSenderAndReceiverBalanceAndCreateTransaction = async (props: UpdateBalanceProps): Promise<Account | undefined> => {
  const { accountId, accountNumber, senderBalance, receiverBalance, amount, message } = props;  
  const newSenderBalance = Number(senderBalance) - Number(amount);
  const newReceiverBalance = Number(receiverBalance) + Number(amount);

  try {
    const updatedSenderAccount = await getConnection().transaction(async (transactionManager) => {
      const accountRepository = transactionManager.getRepository(Account);

      // Update sender's balance
      await accountRepository.update({ id: accountId }, { balance: newSenderBalance });

      // Sender transaction
      await createTransactionRepository({
        amount,
        message,
        status: TransactionStatus.SUCCESS,
        type: TransactionType.DEBIT,
        accountId,
      });

      // Update receiver's balance
      const updatedReceiverResult = await accountRepository.update({ accountNumber: accountNumber }, { balance: newReceiverBalance });

      if (updatedReceiverResult.affected && updatedReceiverResult.affected > 0) {
        const receiver = await accountRepository.findOne({ accountNumber: accountNumber });

        // Receiver transaction
        await createTransactionRepository({
          amount,
          message,
          status: TransactionStatus.SUCCESS,
          type: TransactionType.CREDIT,
          accountId: receiver?.id,
        });
      }

      // Return the updated sender account
      return await accountRepository.findOne(accountId);
    });

    return updatedSenderAccount;
  } catch (error) {
    logger.error('updateSenderAndReceiverBalanceAndCreateTransaction failed', error);
    throw error;
  }
};
