import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../common/shared/logger';
import { Company } from '../entities/company.entity';
import { Account } from '../../account/entities/account.entity';
import { computeCardExpiryYear, hashCardPin, generateAccountNumber, generateCardCvv, generateMasterCardNumber } from '../../../common/utils';
import { DEFAULT_CREDITED_BALANCE, DEFAULT_PIN } from '../../../common/shared/constant';
import { Card } from '../../card/entities/card.entity';
import { CardType } from '../../card/enums';
import {
  findByCompanyNameRepository,
  findByEmailRepository,
  fetchActiveCompanyRepository,
  findCompanyByIdRepository,
  retrieveCompaniesRepository,
  retrieveCompanyRepository,
  saveCompanyToDatabaseRepository,
} from '../repository/company.repository';
import { CurrencyType } from '../../account/enums';
import { TransactionStatus, TransactionType } from '../../transaction/enums';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { PaginationArgs } from '../../../common/shared/types';
import { CompanyStatus } from '../enums';
import { comparePassword, hashPassword } from '../../../config/bcrypt';
import { generateJwtToken } from '../../../config/jwt';

export const signup = async (req: Request, res: Response) => {
  const { companyName, email, companyAddress, yearFounded, password } = req.body;

  try {
    const existingCompanyName = await findByCompanyNameRepository(companyName);

    if (existingCompanyName) {
      return res.status(StatusCodes.CONFLICT).send({
        status: false,
        message: 'Company with the same name already exists.',
        data: null,
      });
    }

    const existingEmail = await findByEmailRepository(email);

    if (existingEmail) {
      return res.status(StatusCodes.CONFLICT).send({
        status: false,
        message: 'Email already in use.',
        data: null,
      });
    }

    const hashedCardPin = await hashCardPin(DEFAULT_PIN);
    const accountNumber = await generateAccountNumber();

    await getConnection().transaction(async (manager) => {
      const hashedPass = await hashPassword(password);
      const payload = { companyName, email, companyAddress, yearFounded, password: hashedPass };
      

      const company = await manager.save(Company, payload);
      const createdBy = company?.id;
      const token = await generateJwtToken({ createdBy, email });

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
        pin: hashedCardPin,
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
        message: 'Signup successfully',
        data: { ...company, accessToken: token },
      });
    });
  } catch (error: any) {
    console.log('company error', error);
    
    logger.error('signup failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const company = await findByEmailRepository(email);

    if (!company) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        status: false,
        message: 'Wrong Email or Password combination.',
        data: null,
      });
    }

    const isPasswordMatch = await comparePassword(company?.password, password);

    if (!isPasswordMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        status: false,
        message: 'Wrong Email or Password combination',
        data: null,
      });
    }

    const createdBy = company?.id;
    const token = await generateJwtToken({ createdBy, email });

    return res.status(StatusCodes.CREATED).send({
      status: true,
      message: 'Login successfully',
      data: { ...company, accessToken: token },
    });
  } catch (error: any) {
    logger.error('login failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const companyId = req.currentCompany?.id;

  try {
    const company = await findCompanyByIdRepository(companyId);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Company not found.',
        data: null,
      });
    }

    if (oldPassword === newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        status: false,
        message: `Please you can't use your old password, please change`,
        data: null,
      });
    }

    const isPasswordMatch = await comparePassword(company?.password, oldPassword);

    if (!isPasswordMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        status: false,
        message: 'You entered an incorrect password.',
        data: null,
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    company.password = hashedPassword;

    await saveCompanyToDatabaseRepository(company);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Password updated successfully.',
      data: company,
    });
  } catch (error: any) {
    logger.error('changePassword failed', error);
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
    const existingCompany = await findByCompanyNameRepository(companyName);

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
