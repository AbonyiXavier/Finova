import { Company } from './entities/company.entity';

export type fetchCompanyResult = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  nextPage: boolean;
  companies: Company[];
};
