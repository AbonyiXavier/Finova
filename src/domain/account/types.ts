import { Repository } from 'typeorm';
import { Company } from '../company/entities/company.entity';
import { Account } from './entities/account.entity';

export type FetchResult = {
  company: Company | undefined;
  accountRepository: Repository<Account>;
};
