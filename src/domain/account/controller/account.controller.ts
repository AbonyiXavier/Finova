import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../common/shared/logger';
import { generateAccountNumber } from '../../../common/utils';
import { fetchCompanyAndAccountRepository } from '../repository/account.repository';

export const createAccount = async (req: Request, res: Response) => {
  const { companyId } = req.body;

  try {
    const { company, accountRepository } = await fetchCompanyAndAccountRepository(companyId);

    const acctNumber = await generateAccountNumber();

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'CompanyId not found.',
        data: null,
      });
    }

    const newAccount = accountRepository.create({
      accountNumber: acctNumber,
      company,
    });

    await accountRepository.save(newAccount);

    return res.status(StatusCodes.CREATED).send({
      status: true,
      message: 'Account created successfully',
      data: newAccount,
    });
  } catch (error: any) {
    logger.error('createAccount failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};
