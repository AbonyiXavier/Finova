import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseModel } from '../../../common/shared/model';
import { TABLES } from '../../../common/shared/constant';
import { Card } from '../../card/entities/card.entity';
import { CurrencyType } from '../enums';
import { Company } from '../../company/entities/company.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity(TABLES.account)
export class Account extends BaseModel {
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  accountNumber: string;

  @Column({ default: 0, nullable: true })
  @IsOptional()
  @IsNumber()
  balance: number;

  @Column({
    type: 'enum',
    enum: CurrencyType,
    default: CurrencyType.KR,
    nullable: true,
  })
  @IsEnum(CurrencyType)
  currency: CurrencyType;

  @OneToMany(() => Card, (card) => card.account)
  cards: Card[];

  @ManyToOne(() => Company, (company) => company.accounts)
  company: Company;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
