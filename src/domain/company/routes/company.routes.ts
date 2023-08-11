import express from 'express';
import { createCompany, fetchCompanies, getCompanyById } from '../controller/company.controller';

const router = express.Router();

router.post('/company/create', createCompany);
router.get('/company/:companyId', getCompanyById);
router.get('/company', fetchCompanies);

export default router;
