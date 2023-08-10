import { getRepository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { FetchResult } from '../types';
import logger from '../../../common/shared/logger';
import { findCompanyById } from '../../company/repository/company.repository';

export const fetchCompanyAndAccountRepository = async (companyId: string): Promise<FetchResult> => {
  try {
    const accountRepository = getRepository(Account);
    const company = await findCompanyById(companyId);

    return { company, accountRepository };
  } catch (error) {
    logger.error('fetchCompanyAndAccountRepository failed', error);
    throw error;
  }
};

export const findAccountById = async (accountId: string): Promise<Account | undefined> => {
  try {
    const accountRepository = getRepository(Account);

    const account = await accountRepository.findOne({
      where: { id: accountId },
    });

    return account;
  } catch (error) {
    logger.error('findAccountById failed', error);
    throw error;
  }
};

export const checkExistingAccountNumber = async (accountNumber: string): Promise<Account | undefined> => {
  try {
    const accountRepository = getRepository(Account);

    const existingAccount = await accountRepository.findOne({
      where: { accountNumber },
    });

    return existingAccount;
  } catch (error) {
    logger.error('fcheckExistingAccountNumber failed', error);
    throw error;
  }
};
