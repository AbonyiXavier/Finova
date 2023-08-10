import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../../common/shared/model';
import { TABLES } from '../../../common/shared/constant';
import { CardStatus, CardType, SpendingLimitInterval } from '../enums';
import { Account } from '../../account/entities/account.entity';
import { Company } from '../../company/entities/company.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity(TABLES.card)
export class Card extends BaseModel {
  @Column({ unique: true })
  cardNumber: string;

  @Column({
    type: 'enum',
    enum: CardType,
  })
  cardType: CardType;

  @Column()
  pin: string;

  @Column()
  cvv: number;

  @Column()
  expiryDate: Date;

  @Column({
    type: 'enum',
    enum: CardStatus,
  })
  status: CardStatus;

  @Column({ default: 0 })
  remainingSpend: number;

  @Column({ default: 0 })
  spendingLimit: number;

  @Column({
    type: 'enum',
    enum: SpendingLimitInterval,
  })
  spendingLimitInterval: SpendingLimitInterval;

  @Column()
  spendingLimitDate: Date;

  @ManyToOne(() => Account, (account) => account.cards)
  account: Account;

  @ManyToOne(() => Company, (company) => company.cards)
  company: Company;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transactions: Transaction[];
}
