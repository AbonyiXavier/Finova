import { Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { Company } from '../company/entities/company.entity';
import { Card } from './entities/card.entity';
import { SpendingLimitInterval } from './enums';

export type FetchCardContextRepositoryResult = {
  account: Account | undefined;
  company: Company | undefined;
  cardRepository: Repository<Card>;
};

export type FetchCardResult = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  nextPage: boolean;
  cards: Card[];
};

export type CheckPendingResultConfig = {
  card: Card | undefined;
  cardRepository: Repository<Card>;
};

export type setSpendingLimitConfig = {
  spendingLimit: number;
  spendingLimitInterval: SpendingLimitInterval;
};
