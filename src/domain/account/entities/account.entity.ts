import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../common/shared/model';
import { TABLES } from '../../../common/shared/constant';
import { Card } from '../../card/entities/card.entity';
import { CurrencyType } from '../enums';
import { Company } from '../../company/entities/company.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity(TABLES.account)
export class Account extends BaseModel {
  @Column()
  accountNumber: string;

  @Column({ default: 0 })
  balance: number;

  @Column({
    type: 'enum',
    enum: CurrencyType,
  })
  currency: CurrencyType;

  @OneToMany(() => Card, (card) => card.account)
  cards: Card[];

  @ManyToOne(() => Company, (company) => company.accounts)
  company: Company;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
