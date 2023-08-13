import express from 'express';
import companyRoute from './transaction.routes';

const router = express.Router();

router.use('/v1', companyRoute);

export default router;
