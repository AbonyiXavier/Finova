import express from 'express';
import { fetchTransactions, transferFund } from '../controller/transaction.controller';
import { validateCompanyToken } from '../../../common/middlewares/verifyToken';

const router = express.Router();

router.get('/transaction', [validateCompanyToken], fetchTransactions);
router.post('/transaction/transfer/:accountId', [validateCompanyToken], transferFund);

export default router;
