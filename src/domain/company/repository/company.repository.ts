import { IsNull, getRepository } from 'typeorm';
import { Company } from '../entities/company.entity';
import logger from '../../../common/shared/logger';
import { PaginationArgs, SearchByInput } from '../../../common/shared/types';
import { CompanyResultConfig, FetchCompanyResult } from '../types';
import { CompanyStatus } from '../enums';

export const checkDuplicateCompanyNameRepository = async (companyName: string): Promise<Company | undefined> => {
  try {
    const companyRepository = getRepository(Company);

    const existingCompany = await companyRepository.findOne({
      where: { companyName },
    });

    return existingCompany;
  } catch (error) {
    logger.error('checkDuplicateCompanyNameRepository failed', error);
    throw error;
  }
};

export const findCompanyByIdRepository = async (companyId: string): Promise<Company | undefined> => {
  try {
    const companyRepository = getRepository(Company);

    const company = await companyRepository.findOne({
      where: { id: companyId },
    });

    return company;
  } catch (error) {
    logger.error('findCompanyByIdRepository failed', error);
    throw error;
  }
};

export const retrieveCompanyAndSearchRepository = async (companyId: string, searchInput?: SearchByInput): Promise<Company | undefined> => {
  try {
    const companyRepository = getRepository(Company);

    const query = companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.accounts', 'accounts')
      .leftJoinAndSelect('company.cards', 'cards');

    if (searchInput?.searchText) {
      query.where('accounts.accountNumber = :searchText', {
        searchText: searchInput.searchText,
      });

      // Search for cardNumber within the cards array
      query.orWhere('cards.cardNumber = :searchText', {
        searchText: searchInput.searchText,
      });
    }

    query.andWhere('company.id = :companyId', { companyId });

    const company = await query.getOne();

    return company;
  } catch (error) {
    logger.error('retrieveCompanyRepository failed', error);
    throw error;
  }
};

export const retrieveCompaniesPaginatedAndSearchRepository = async (
  paginationArgs: PaginationArgs,
  searchInput?: SearchByInput,
): Promise<FetchCompanyResult> => {
  const { limit, offset } = paginationArgs;

  try {
    const companyRepository = getRepository(Company);

    const query = companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.accounts', 'accounts')
      .leftJoinAndSelect('company.cards', 'cards');

    if (searchInput?.searchText) {
      query.where('company.companyName = :searchText', {
        searchText: searchInput.searchText,
      });

      query.orWhere('company.companyAddress = :searchText', {
        searchText: searchInput.searchText,
      });
    }

    query.andWhere('company.status = :status', { status: CompanyStatus.ACTIVE });

    if (limit !== -1) {
      query.limit(limit);
      query.offset(offset ? offset * limit : 0);
    }

    const [items, totalCount] = await query.orderBy('company.created_at', 'DESC').getManyAndCount();

    const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;
    const currentPage = offset < totalPages ? offset + 1 : totalPages;
    const nextPage = limit !== -1 && items.length >= limit;

    return {
      totalCount,
      totalPages,
      currentPage,
      nextPage,
      companies: items,
    };
  } catch (error) {
    logger.error('retrieveCompaniesPaginatedAndSearchRepository failed', error);
    throw error;
  }
};

export const fetchActiveCompanyRepository = async (companyId: string): Promise<CompanyResultConfig> => {
  try {
    const companyRepository = getRepository(Company);

    const company = await companyRepository.findOne({
      where: { id: companyId, status: CompanyStatus.ACTIVE },
    });

    return { company, companyRepository };
  } catch (error) {
    logger.error('fetchActiveCompanyRepository failed', error);
    throw error;
  }
};

export const deactivateActiveCompanyRepository = async (companyId: string): Promise<CompanyResultConfig> => {
  try {
    const companyRepository = getRepository(Company);

    const company = await companyRepository.findOne({
      where: { id: companyId, status: CompanyStatus.ACTIVE, deletedAt: IsNull() },
    });

    return { company, companyRepository };
  } catch (error) {
    logger.error('deactivateActiveCompanyRepository failed', error);
    throw error;
  }
};
