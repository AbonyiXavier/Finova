import { LessThanOrEqual, getRepository } from 'typeorm';
import logger from '../../../common/shared/logger';
import { findAccountByIdRepository } from '../../account/repository/account.repository';
import { findCompanyByIdRepository } from '../../company/repository/company.repository';
import { Card } from '../entities/card.entity';
import { CheckPendingResultConfig, FetchCardContextRepositoryResult, FetchCardResult } from '../types';
import { PaginationArgs, SearchByInput } from '../../../common/shared/types';
import { CardStatus } from '../enums';

export const fetchCardContextRepository = async (accountId: string, companyId: string): Promise<FetchCardContextRepositoryResult> => {
  try {
    const cardRepository = getRepository(Card);

    const account = await findAccountByIdRepository(accountId);
    const company = await findCompanyByIdRepository(companyId);

    return { account, company, cardRepository };
  } catch (error) {
    logger.error('fetchCardContextRepository failed', error);
    throw error;
  }
};

export const findCardByIdRepository = async (cardId: string): Promise<Card | undefined> => {
  try {
    const cardRepository = getRepository(Card);

    const card = await cardRepository.findOne({
      where: { id: cardId },
      relations: ['company', 'account', 'transactions'],
    });

    return card;
  } catch (error) {
    logger.error('findCardByIdRepository failed', error);
    throw error;
  }
};

export const checkPendingCardRepository = async (cardId: string): Promise<CheckPendingResultConfig> => {
  try {
    const cardRepository = getRepository(Card);

    const card = await cardRepository.findOne({
      where: { id: cardId, status: CardStatus.PENDING },
    });

    return { card, cardRepository };
  } catch (error) {
    logger.error('checkPendingCardRepository failed', error);
    throw error;
  }
};

export const checkActiveCardRepository = async (cardId: string): Promise<CheckPendingResultConfig> => {
  try {
    const cardRepository = getRepository(Card);

    const card = await cardRepository.findOne({
      where: { id: cardId, status: CardStatus.ACTIVATED },
    });

    return { card, cardRepository };
  } catch (error) {
    logger.error('checkActiveCardRepository failed', error);
    throw error;
  }
};

export const retrievePendingCardsRepository = async (
  companyId: string,
  paginationArgs: PaginationArgs,
  searchInput?: SearchByInput,
): Promise<FetchCardResult> => {
  const { limit, offset } = paginationArgs;

  try {
    const cardRepository = getRepository(Card);

    const query = cardRepository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.company', 'company')
      .where('card.status = :status', { status: CardStatus.PENDING })
      .andWhere('company.id = :companyId', { companyId });

    if (searchInput?.searchText) {
      query.andWhere('card.cardNumber = :searchText', {
        searchText: searchInput.searchText,
      });
    }

    if (limit !== -1) {
      query.limit(limit);
      query.offset(offset ? offset * limit : 0);
    }

    const [items, totalCount] = await query.orderBy('card.created_at', 'DESC').getManyAndCount();

    const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;
    const currentPage = offset < totalPages ? offset + 1 : totalPages;
    const nextPage = limit !== -1 && items.length >= limit;

    return {
      totalCount,
      totalPages,
      currentPage,
      nextPage,
      cards: items,
    };
  } catch (error) {
    logger.error('retrievePendingCardsRepository failed', error);
    throw error;
  }
};

export const retrieveActivatedCardsRepository = async (
  companyId: string,
  paginationArgs: PaginationArgs,
  searchInput?: SearchByInput,
): Promise<FetchCardResult> => {
  const { limit, offset } = paginationArgs;

  try {
    const cardRepository = getRepository(Card);

    const query = cardRepository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.company', 'company')
      .where('card.status = :status', { status: CardStatus.ACTIVATED })
      .andWhere('company.id = :companyId', { companyId });

    if (searchInput?.searchText) {
      query.andWhere('card.cardNumber = :searchText', {
        searchText: searchInput.searchText,
      });
    }

    if (limit !== -1) {
      query.limit(limit);
      query.offset(offset ? offset * limit : 0);
    }

    const [items, totalCount] = await query.orderBy('card.created_at', 'DESC').getManyAndCount();

    const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;
    const currentPage = offset < totalPages ? offset + 1 : totalPages;
    const nextPage = limit !== -1 && items.length >= limit;

    return {
      totalCount,
      totalPages,
      currentPage,
      nextPage,
      cards: items,
    };
  } catch (error) {
    logger.error('retrieveActivatedCardsRepository failed', error);
    throw error;
  }
};

export const expireCardsWhenDue = async () => {
  try {
    const cardRepository = getRepository(Card);

    const cards = await cardRepository.find({
      where: {
        status: CardStatus.ACTIVATED,
        expiryDate: LessThanOrEqual(new Date()),
      },
    });

    const newData = {
      status: CardStatus.EXPIRED,
    };

    await Promise.all(
      cards.map((card) => {
        // Update the card properties
        card.status = newData.status;

        // Save the updated company
        cardRepository.save(card);
      }),
    );
  } catch (error) {
    logger.error('expireCardsWhenDue failed', error);
    throw error;
  }
};
