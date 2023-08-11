import { getRepository } from 'typeorm';
import logger from '../../../common/shared/logger';
import { findAccountById } from '../../account/repository/account.repository';
import { findCompanyById } from '../../company/repository/company.repository';
import { Card } from '../entities/card.entity';
import { fetchCardContextResult } from '../types';

export const fetchCardContext = async (accountId: string, companyId: string): Promise<fetchCardContextResult> => {
  try {
    const cardRepository = getRepository(Card);

    const account = await findAccountById(accountId);
    const company = await findCompanyById(companyId);

    return { account, company, cardRepository };
  } catch (error) {
    logger.error('fetchCardContext failed', error);
    throw error;
  }
};
