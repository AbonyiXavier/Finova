import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../common/shared/model';
import { TABLES } from '../../../common/shared/constant';
import { Card } from '../../card/entities/card.entity';
import { TransactionStatus, TransactionType } from '../enums';
import { Account } from '../../account/entities/account.entity';

@Entity(TABLES.transaction)
export class Transaction extends BaseModel {
  @Column()
  amount: number;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @ManyToOne(() => Card, (card) => card.transactions)
  card: Card;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;
}
