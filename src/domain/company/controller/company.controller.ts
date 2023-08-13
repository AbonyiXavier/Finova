import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../common/shared/logger';
import { Company } from '../entities/company.entity';
import { Account } from '../../account/entities/account.entity';
import { computeCardExpiryYear, encryptCardPin, generateAccountNumber, generateCardCvv, generateMasterCardNumber } from '../../../common/utils';
import { DEFAULT_CREDITED_BALANCE, DEFAULT_PIN } from '../../../common/shared/constant';
import { Card } from '../../card/entities/card.entity';
import { CardType } from '../../card/enums';
import {
  checkDuplicateCompanyNameRepository,
  fetchActiveCompanyRepository,
  findCompanyByIdRepository,
  retrieveCompaniesRepository,
  retrieveCompanyRepository,
} from '../repository/company.repository';
import { CurrencyType } from '../../account/enums';
import { TransactionStatus, TransactionType } from '../../transaction/enums';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { PaginationArgs } from '../../../common/shared/types';
import { CompanyStatus } from '../enums';

export const createCompany = async (req: Request, res: Response) => {
  const { companyName, companyAddress, yearFounded } = req.body;

  try {
    const existingCompany = await checkDuplicateCompanyNameRepository(companyName);

    if (existingCompany) {
      return res.status(StatusCodes.CONFLICT).send({
        status: false,
        message: 'Company with the same name already exists.',
        data: null,
      });
    }

    const encryptedCardPin = await encryptCardPin(DEFAULT_PIN);
    const accountNumber = await generateAccountNumber();

    await getConnection().transaction(async (manager) => {
      const payload = { companyName, companyAddress, yearFounded };
      const company = await manager.save(Company, payload);
      const createdBy = company?.id;

      // create account with a default balance of 12000 kr
      const accountPayload = {
        balance: DEFAULT_CREDITED_BALANCE,
        accountNumber: accountNumber,
        company,
        createdBy,
      };

      const account = await manager.save(Account, accountPayload);

      // create card for company with a default cardType: master
      const cardPayload = {
        cardNumber: generateMasterCardNumber(),
        expiryDate: computeCardExpiryYear(company?.createdAt),
        cvv: generateCardCvv(),
        pin: encryptedCardPin,
        cardType: CardType.MASTER,
        company,
        account,
        createdBy,
      };

      const card = await manager.save(Card, cardPayload);

      // create copy of transaction for account created with transactionType : credit
      const transactionPayload = {
        amount: account?.balance,
        message: `Account was credited with sum of ${DEFAULT_CREDITED_BALANCE}${CurrencyType.KR}`,
        status: TransactionStatus.SUCCESS,
        type: TransactionType.CREDIT,
        card,
        account,
        createdBy,
      };

      await manager.save(Transaction, transactionPayload);

      return res.status(StatusCodes.CREATED).send({
        status: true,
        message: 'Company created successfully',
        data: company,
      });
    });
  } catch (error: any) {
    logger.error('createCompany failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { searchText } = req.query;
  const searchInput = searchText ? { searchText: searchText.toString() } : undefined;

  try {
    const company = await findCompanyByIdRepository(companyId);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Company not found.',
        data: null,
      });
    }

    const companyData = await retrieveCompanyRepository(companyId, searchInput);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Company fetched successfully',
      data: companyData,
    });
  } catch (error: any) {
    logger.error('getCompanyById failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const fetchCompanies = async (req: Request, res: Response) => {
  const { searchText, limit, offset } = req.query;
  const searchInput = searchText ? { searchText: searchText.toString() } : undefined;
  const paginationArgs = { limit, offset } as unknown as PaginationArgs;

  try {
    const companies = await retrieveCompaniesRepository(paginationArgs, searchInput);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Company fetched successfully',
      data: companies,
    });
  } catch (error: any) {
    logger.error('getCompanyById failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { companyName, companyAddress, yearFounded } = req.body;

  try {
    const existingCompany = await checkDuplicateCompanyNameRepository(companyName);

    if (existingCompany) {
      return res.status(StatusCodes.CONFLICT).send({
        status: false,
        message: 'Company with the same name already exists.',
        data: null,
      });
    }

    const { company, companyRepository } = await fetchActiveCompanyRepository(companyId);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Active Company not found.',
        data: null,
      });
    }

    const newData = {
      companyName,
      companyAddress,
      yearFounded,
      updatedBy: companyId,
    };

    // Update the company properties
    Object.assign(company, newData);

    // Save the updated company
    const updatedCompany = await companyRepository.save(company);

    return res.status(StatusCodes.CREATED).send({
      status: true,
      message: 'Company data updated successfully',
      data: updatedCompany,
    });
  } catch (error: any) {
    logger.error('updateCompany failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const deactivateCompany = async (req: Request, res: Response) => {
  const { companyId } = req.params;

  try {
    const { company, companyRepository } = await fetchActiveCompanyRepository(companyId);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Active Company not found.',
        data: null,
      });
    }

    const newData = {
      status: CompanyStatus.DEACTIVATE,
      deletedAt: new Date(),
      deleteBy: companyId,
    };

    // Update the company properties
    Object.assign(company, newData);

    // Save the updated company
    const updatedCompany = await companyRepository.save(company);

    return res.status(StatusCodes.CREATED).send({
      status: true,
      message: 'Company deactivated successfully',
      data: updatedCompany,
    });
  } catch (error: any) {
    logger.error('deactivateCompany failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};
