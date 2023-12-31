import * as dotenv from 'dotenv';
dotenv.config();

import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Account } from './src/domain/account/entities/account.entity';
import { Card } from './src/domain/card/entities/card.entity';
import { Company } from './src/domain/company/entities/company.entity';
import { Transaction } from './src/domain/transaction/entities/transaction.entity';

const qred_db = JSON.parse(`${process.env.DATABASE_CREDENTIALS}`);
const currentEnv = `${process.env.NODE_ENV}`;

export default {
  type: 'postgres',
  host: qred_db.host,
  port: qred_db.port,
  username: qred_db.username,
  password: qred_db.password,
  database: qred_db.database,
  logging: ['development'].includes(currentEnv) ? true : ['error'],
  schema: 'public',
  dropSchema: false,
  synchronize: true,
  entities: [Account, Card, Company, Transaction],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['dist/src/database/migrations/*.js'],
  cli: {
    migrationsDir: ['production'].includes(currentEnv) ? 'dist/src/database/migrations' : 'src/database/migrations',
  },
} as ConnectionOptions;
