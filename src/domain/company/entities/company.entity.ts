import { Entity, Column, OneToMany } from 'typeorm';

import { BaseModel } from '../../../common/shared/model';
import { TABLES } from '../../../common/shared/constant';
import { Card } from '../../card/entities/card.entity';
import { CompanyStatus } from '../enums';
import { Account } from '../../account/entities/account.entity';

@Entity(TABLES.company)
export class Company extends BaseModel {
  @Column({ unique: true })
  companyName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  companyAddress: string;

  @Column()
  yearFounded: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.ACTIVE,
  })
  status: CompanyStatus;

  @OneToMany(() => Account, (account) => account.company)
  accounts: Account[];

  @OneToMany(() => Card, (card) => card.company)
  cards: Card[];
}
