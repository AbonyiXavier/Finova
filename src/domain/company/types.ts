import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

export type FetchCompanyResult = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  nextPage: boolean;
  companies: Company[];
};

export type CompanyResultConfig = {
  company: Company | undefined;
  companyRepository: Repository<Company>;
};
