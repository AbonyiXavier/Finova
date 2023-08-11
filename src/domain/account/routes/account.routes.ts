import express from 'express';
import { createAccount, getAccountById } from '../controller/account.controller';

const router = express.Router();

router.post('/account/create', createAccount);
router.get('/account/:accountId', getAccountById);

export default router;
