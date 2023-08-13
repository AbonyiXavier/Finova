import { getRepository } from 'typeorm';
import { PaginationArgs } from '../../../common/shared/types';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionProps, FetchTransactionResult, FilterByTransactionType } from '../types';
import logger from '../../../common/shared/logger';
import { Account } from '../../account/entities/account.entity';

export const retrieveTransactionsRepository = async (
  paginationArgs: PaginationArgs,
  filterByInput?: FilterByTransactionType,
): Promise<FetchTransactionResult> => {
  const { limit, offset } = paginationArgs;

  try {
    const transactionRepository = getRepository(Transaction);

    const query = transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('transaction.card', 'card');

    if (filterByInput?.type) {
      query.where('transaction.type = :type', {
        type: filterByInput.type,
      });
    }

    if (limit !== -1) {
      query.limit(limit);
      query.offset(offset ? offset * limit : 0);
    }

    const [items, totalCount] = await query.orderBy('transaction.created_at', 'DESC').getManyAndCount();

    const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 1;
    const currentPage = offset < totalPages ? offset + 1 : totalPages;
    const nextPage = limit !== -1 && items.length >= limit;

    return {
      totalCount,
      totalPages,
      currentPage,
      nextPage,
      transactions: items,
    };
  } catch (error) {
    logger.error('retrieveTransactionsRepository failed', error);
    throw error;
  }
};

export const createTransactionRepository = async (props: CreateTransactionProps): Promise<Transaction> => {
  const { amount, message, status, type, accountId } = props;

  try {
    const transactionRepository = getRepository(Transaction);
    const accountRepository = getRepository(Account);

    const account = await accountRepository.findOne({ id: accountId });

    // Create a new transaction
    const transaction = new Transaction();
    if (account) {
      transaction.amount = amount;
      transaction.message = message;
      transaction.status = status;
      transaction.type = type;
      transaction.account = account;
    }

    // Save the transaction
    return transactionRepository.save(transaction);
  } catch (error) {
    logger.error('createTransactionRepository failed', error);
    throw error;
  }
};
