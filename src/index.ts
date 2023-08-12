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
import logger from './common/shared/logger';
import { expireCardsWhenDue } from './domain/card/repository/card.repository';

dotenv.config();

require('./config/env.validation');

initializeDBConnection();

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', companyRouter);
app.use('/api', cardRouter);
app.use('/api', accountRouter);

/**
 * Cron job runs for 12:00 am
 * To update card status to expired when expiryDate is due
 *
 */
const job = new CronJob(
  '0 0 * * *',
  async () => {
    logger.info('.....cron job running.....');
    expireCardsWhenDue();
  },
  null,
  true,
  'Europe/Brussels',
);

job.start();

app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: true,
    message: 'Qred Api 👈👈',
  });
});

app.all('*', (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: false,
    message: 'The requested resource could not be found.',
  });
});

export default app;
