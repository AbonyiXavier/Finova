import express from 'express';
import { fetchTransactions, transferFund } from '../controller/transaction.controller';

const router = express.Router();

router.get('/transaction', fetchTransactions);
router.post('/transaction/transfer/:accountId', transferFund);

export default router;
