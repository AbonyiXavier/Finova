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
import { checkDuplicateCompanyName } from '../repository/company.repository';
import { CurrencyType } from '../../account/enums';
import { TransactionStatus, TransactionType } from '../../transaction/enums';
import { Transaction } from '../../transaction/entities/transaction.entity';

export const createCompany = async (req: Request, res: Response) => {
  const { companyName, companyAddress, yearFounded } = req.body;

  try {
    const existingCompany = await checkDuplicateCompanyName(companyName);

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
        message: `Account was credited with sum of ${DEFAULT_CREDITED_BALANCE}${CurrencyType.KR} `,
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
