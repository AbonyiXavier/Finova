import * as dotenv from 'dotenv';
dotenv.config();

import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
  synchronize: false,
  entities: ['dist/src/**/*.entity.js'],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['dist/src/database/migrations/*.js'],
  cli: {
    migrationsDir: ['production'].includes(currentEnv) ? 'dist/src/database/migrations' : 'src/database/migrations',
  },
} as ConnectionOptions;
