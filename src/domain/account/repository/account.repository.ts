import { getRepository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { FetchResult } from '../types';
import logger from '../../../common/shared/logger';
import { findCompanyByIdRepository } from '../../company/repository/company.repository';
import { SearchByInput } from '../../../common/shared/types';

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

export const retrieveAccountAndSearchRepository = async (accountId: string, searchInput?: SearchByInput): Promise<Account | undefined> => {
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
    logger.error('retrieveAccountAndSearchRepository failed', error);
    throw error;
  }
};
