import express from 'express';
import { fetchTransactions, transferFund } from '../controller/transaction.controller';
import { validateCompanyToken } from '../../../common/middleware/verifyToken';
import { validationMiddleware } from '../../../common/middleware/validationMiddleware';
import { transferFundValidation } from '../../../validations/transaction.validation';

const router = express.Router();

router.get('/transaction', [validateCompanyToken], fetchTransactions);
router.post('/transaction/transfer/:accountId', [validationMiddleware(transferFundValidation), validateCompanyToken], transferFund);

export default router;
