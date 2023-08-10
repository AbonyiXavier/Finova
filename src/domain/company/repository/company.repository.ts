import { getRepository } from 'typeorm';
import { Company } from '../entities/company.entity';
import logger from '../../../common/shared/logger';

export const checkDuplicateCompanyName = async (companyName: string): Promise<Company | undefined> => {
  try {
    const companyRepository = getRepository(Company);

    const existingCompany = await companyRepository.findOne({
      where: { companyName },
    });

    return existingCompany;
  } catch (error) {
    logger.error('checkDuplicateCompanyName failed', error);
    throw error;
  }
};

export const findCompanyById = async (companyId: string): Promise<Company | undefined> => {
  try {
    const companyRepository = getRepository(Company);

    const company = await companyRepository.findOne({
      where: { id: companyId },
    });

    return company;
  } catch (error) {
    logger.error('findCompanyById failed', error);
    throw error;
  }
};
