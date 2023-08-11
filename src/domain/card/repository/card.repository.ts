import { getRepository } from 'typeorm';
import logger from '../../../common/shared/logger';
import { findAccountByIdRepository } from '../../account/repository/account.repository';
import { findCompanyByIdRepository } from '../../company/repository/company.repository';
import { Card } from '../entities/card.entity';
import { fetchCardContextRepositoryResult } from '../types';

export const fetchCardContextRepository = async (accountId: string, companyId: string): Promise<fetchCardContextRepositoryResult> => {
  try {
    const cardRepository = getRepository(Card);

    const account = await findAccountByIdRepository(accountId);
    const company = await findCompanyByIdRepository(companyId);

    return { account, company, cardRepository };
  } catch (error) {
    logger.error('fetchCardContextRepository failed', error);
    throw error;
  }
};
