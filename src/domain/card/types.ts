import { Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { Company } from '../company/entities/company.entity';
import { Card } from './entities/card.entity';

export type fetchCardContextRepositoryResult = {
  account: Account | undefined;
  company: Company | undefined;
  cardRepository: Repository<Card>;
};
