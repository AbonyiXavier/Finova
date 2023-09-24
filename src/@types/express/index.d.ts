import { Company } from '../../domain/company/entities/company.entity';

declare global {
  namespace Express {
    interface Request {
      currentCompany: Company;
    }
  }
}
