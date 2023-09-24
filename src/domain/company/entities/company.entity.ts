import { Entity, Column, OneToMany } from 'typeorm';
import { IsEnum, IsString } from 'class-validator';

import { BaseModel } from '../../../common/shared/model';
import { TABLES } from '../../../common/shared/constant';
import { Card } from '../../card/entities/card.entity';
import { CompanyStatus } from '../enums';
import { Account } from '../../account/entities/account.entity';

@Entity(TABLES.company)
export class Company extends BaseModel {
  @Column()
  @IsString()
  companyName: string;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  companyAddress: string;

  @Column()
  @IsString()
  yearFounded: string;

  @Column()
  @IsString()
  password: string;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.ACTIVE,
  })
  @IsEnum(CompanyStatus)
  status: CompanyStatus;

  @OneToMany(() => Account, (account) => account.company)
  accounts: Account[];

  @OneToMany(() => Card, (card) => card.company)
  cards: Card[];
}
