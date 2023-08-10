import express from 'express';
import { createCompany } from '../controller/company.controller';

const router = express.Router();

router.post('/company/create', createCompany);

export default router;
