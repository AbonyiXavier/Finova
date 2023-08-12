import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../../../common/shared/logger';
import {
  generateCardCvv,
  generateMasterCardNumber,
  generateVisaCardNumber,
  encryptCardPin,
  computeCardExpiryYear,
  validatePin,
  getSpendingLimitExpirationDate,
} from '../../../common/utils';
import { DEFAULT_PIN } from '../../../common/shared/constant';
import { CardStatus, CardType } from '../enums';
import {
  checkActiveCardRepository,
  checkPendingCardRepository,
  fetchCardContextRepository,
  findCardByIdRepository,
  retrieveActivatedCardsRepository,
  retrievePendingCardsRepository,
} from '../repository/card.repository';
import { findCompanyByIdRepository } from '../../company/repository/company.repository';
import { PaginationArgs } from '../../../common/shared/types';
import { setSpendingLimitConfig } from '../types';

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

export const getCardById = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const card = await findCardByIdRepository(cardId);

    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Card not found.',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Card fetched successfully',
      data: card,
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

export const activateCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    const { card, cardRepository } = await checkPendingCardRepository(cardId);

    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Card not found.',
        data: null,
      });
    }

    const newData = {
      status: CardStatus.ACTIVATED,
    };

    // Update the card properties
    card.status = newData.status;

    // Save the updated card
    const cardData = await cardRepository.save(card);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Card activated successfully',
      data: cardData,
    });
  } catch (error: any) {
    logger.error('activateCard failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const updateCardPin = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { pin } = req.body;

  try {
    const encryptedCardPin = await encryptCardPin(pin);
    const { card, cardRepository } = await checkActiveCardRepository(cardId);

    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Card not found.',
        data: null,
      });
    }

    const isValidPin = validatePin(pin);

    if (!isValidPin) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        status: false,
        message: 'PIN must be a 4-digit string',
        data: null,
      });
    }

    const newData = {
      pin: encryptedCardPin,
    };

    // Update the card properties
    card.pin = newData.pin;

    // Save the updated card
    const cardData = await cardRepository.save(card);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Card pin updated successfully',
      data: cardData,
    });
  } catch (error: any) {
    logger.error('updateCardPin failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const getPendingCardsByCompanyId = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { searchText, limit, offset } = req.query;
  const searchInput = searchText ? { searchText: searchText.toString() } : undefined;
  const paginationArgs = { limit, offset } as unknown as PaginationArgs;

  try {
    const company = await findCompanyByIdRepository(companyId);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Company not found.',
        data: null,
      });
    }

    const pendingCards = await retrievePendingCardsRepository(companyId, paginationArgs, searchInput);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Pending cards fetched successfully',
      data: pendingCards,
    });
  } catch (error: any) {
    logger.error('getPendingCardsByCompanyId failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const getActivatedCardsByCompanyId = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { searchText, limit, offset } = req.query;
  const searchInput = searchText ? { searchText: searchText.toString() } : undefined;
  const paginationArgs = { limit, offset } as unknown as PaginationArgs;

  try {
    const company = await findCompanyByIdRepository(companyId);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Company not found.',
        data: null,
      });
    }

    const activatedCards = await retrieveActivatedCardsRepository(companyId, paginationArgs, searchInput);

    return res.status(StatusCodes.OK).send({
      status: true,
      message: 'Activated cards fetched successfully',
      data: activatedCards,
    });
  } catch (error: any) {
    logger.error('getActivatedCardsByCompanyId failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};

export const setCardSpendingLimit = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { spendingLimit, spendingLimitInterval }: setSpendingLimitConfig = req.body;

  try {
    const { card, cardRepository } = await checkActiveCardRepository(cardId);

    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: false,
        message: 'Invalid card id and can only set limit on activated card.',
        data: null,
      });
    }

    card.spendingLimit = spendingLimit;
    card.spendingLimitInterval = spendingLimitInterval;

    const spendingLimitExpirationDate = getSpendingLimitExpirationDate(spendingLimitInterval, card?.createdAt);

    // Update spending limit date
    card.spendingLimitDate = spendingLimitExpirationDate;

    // Save the updated card
    const cardData = await cardRepository.save(card);

    return res.status(StatusCodes.CREATED).send({
      status: false,
      message: 'Card spending limit set successfully',
      data: cardData,
    });
  } catch (error: any) {
    logger.error('setCardSpendingLimit failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error?.message,
      data: null,
    });
  }
};
