import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../common/shared/logger';
import { generateCardCvv, generateMasterCardNumber, generateVisaCardNumber, encryptCardPin, computeCardExpiryYear } from '../../../common/utils';
import { DEFAULT_PIN } from '../../../common/shared/constant';
import { CardType } from '../enums';
import { fetchCardContextRepository } from '../repository/card.repository';

export const createCard = async (req: Request, res: Response) => {
  const { cardType, companyId, accountId } = req.body;

  try {
    const encryptedCardPin = await encryptCardPin(DEFAULT_PIN);
    const cardNumberGenerators = {
      [CardType.MASTER]: generateMasterCardNumber,
      [CardType.VISA]: generateVisaCardNumber,
    };

    const cardNumberGenerator = cardNumberGenerators[cardType] || generateMasterCardNumber;

    const data = cardNumberGenerator();

    const { account, company, cardRepository } = await fetchCardContextRepository(accountId, companyId);

    if (!account) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Account not found.',
        data: null,
      });
    }

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Company not found.',
        data: null,
      });
    }

    const newCard = cardRepository.create({
      cardNumber: data,
      expiryDate: computeCardExpiryYear(new Date()),
      cvv: generateCardCvv(),
      pin: encryptedCardPin,
      cardType,
      company,
      account,
      createdBy: companyId,
    });

    await cardRepository.save(newCard);
    return res.status(StatusCodes.CREATED).send({
      status: true,
      message: 'Card added successfully',
      data: newCard,
    });
  } catch (error: any) {
    logger.error('createCard failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};
