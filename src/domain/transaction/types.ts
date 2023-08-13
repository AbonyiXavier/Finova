import { Transaction } from './entities/transaction.entity';
import { TransactionStatus, TransactionType } from './enums';

export type FetchTransactionResult = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  nextPage: boolean;
  transactions: Transaction[];
};

export type FilterByTransactionType = {
  type: TransactionType;
};

export type transferFundConfig = {
  accountNumber: string;
  amount: number;
  message: string;
};

export type CreateTransactionProps = {
  amount: number;
  message: string;
  status: TransactionStatus;
  type: TransactionType;
  accountId: string | undefined;
};

export type UpdateBalanceProps = {
  accountNumber: string;
  accountId: string;
  senderBalance: number;
  receiverBalance: number;
  amount: number;
  message: string;
};
