import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseModel } from '../../../common/shared/model';
import { TABLES } from '../../../common/shared/constant';
import { CardStatus, CardType, SpendingLimitInterval } from '../enums';
import { Account } from '../../account/entities/account.entity';
import { Company } from '../../company/entities/company.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity(TABLES.card)
export class Card extends BaseModel {
  @Column({ unique: true })
  @IsOptional()
  @IsString()
  cardNumber: string;

  @Column({
    type: 'enum',
    enum: CardType,
  })
  @IsEnum(CardType)
  cardType: CardType;

  @Column()
  @IsString()
  pin: string;

  @Column()
  @IsNumber()
  cvv: number;

  @Column()
  @IsDate()
  expiryDate: Date;

  @Column({
    type: 'enum',
    enum: CardStatus,
    default: CardStatus.PENDING,
  })
  @IsEnum(CardStatus)
  status: CardStatus;

  @Column({ default: 0, nullable: true })
  @IsOptional()
  @IsNumber()
  remainingSpend: number;

  @Column({ default: 0, nullable: true })
  @IsOptional()
  @IsNumber()
  spendingLimit: number;

  @Column({
    type: 'enum',
    enum: SpendingLimitInterval,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(SpendingLimitInterval)
  spendingLimitInterval: SpendingLimitInterval;

  @Column({ nullable: true })
  @IsOptional()
  @IsDate()
  spendingLimitDate: Date;

  @ManyToOne(() => Account, (account) => account.cards)
  account: Account;

  @ManyToOne(() => Company, (company) => company.cards)
  company: Company;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transactions: Transaction[];
}
