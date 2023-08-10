import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { initializeDBConnection } from './config';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

require('./config/env.validation');

initializeDBConnection();

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
