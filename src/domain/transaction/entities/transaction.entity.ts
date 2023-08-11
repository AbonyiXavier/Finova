import { Entity, Column, ManyToOne } from 'typeorm';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseModel } from '../../../common/shared/model';
import { TABLES } from '../../../common/shared/constant';
import { Card } from '../../card/entities/card.entity';
import { TransactionStatus, TransactionType } from '../enums';
import { Account } from '../../account/entities/account.entity';

@Entity(TABLES.transaction)
export class Transaction extends BaseModel {
  @Column()
  @IsNumber()
  amount: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  message: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
  })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ManyToOne(() => Card, (card) => card.transactions)
  card: Card;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;
}
