import express from 'express';
import { createAccount, getAccountById } from '../controller/account.controller';
import { validateCompanyToken } from '../../../common/middlewares/verifyToken';

const router = express.Router();

router.post('/account/create', [validateCompanyToken], createAccount);
router.get('/account/:accountId', [validateCompanyToken], getAccountById);

export default router;
