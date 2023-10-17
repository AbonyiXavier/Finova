import express from 'express';
import { createAccount, getAccountById } from '../controller/account.controller';
import { validateCompanyToken } from '../../../common/middleware/verifyToken';
import { validationMiddleware } from '../../../common/middleware/validationMiddleware';
import { createAccountValidation, getAccountByIdValidation } from '../../../validations/account.validation';

const router = express.Router();

router.post('/account/create', [validationMiddleware(createAccountValidation), validateCompanyToken], createAccount);
router.get('/account/:accountId', [validationMiddleware(getAccountByIdValidation), validateCompanyToken], getAccountById);

export default router;
