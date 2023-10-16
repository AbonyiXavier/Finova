import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { initializeDBConnection } from './config';
import { StatusCodes } from 'http-status-codes';
import { CronJob } from 'cron';

import companyRouter from './domain/company/routes';
import cardRouter from './domain/card/routes';
import accountRouter from './domain/account/routes';
import transactionRouter from './domain/transaction/routes';
import logger from './common/shared/logger';
import { expireCardsWhenDue, resetSpendLimitAndRemainingSpendWhenDue } from './domain/card/repository/card.repository';

import "reflect-metadata";

dotenv.config();

require('./config/env.validation');

initializeDBConnection();

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(validationMiddleware([]));


app.use('/api', companyRouter);
app.use('/api', cardRouter);
app.use('/api', accountRouter);
app.use('/api', transactionRouter);

/**
 * Cron job runs for 12:00 am
 *
 */
const job = new CronJob(
  '0 0 * * *',
  () => {
    (async () => {
      logger.info('.....cron job running.....');
      try {
        await Promise.all([expireCardsWhenDue(), resetSpendLimitAndRemainingSpendWhenDue()]);
      } catch (error) {
        // Handle errors here
        logger.error('Cron job error:', error);
      }
    })();
  },
  null,
  true,
  'Europe/Brussels',
);

job.start();

app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: true,
    message: 'Finova Api 👈👈',
  });
});

app.all('*', (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: false,
    message: 'The requested resource could not be found.',
  });
});

export default app;
