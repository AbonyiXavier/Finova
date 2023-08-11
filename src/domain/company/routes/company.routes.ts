import express from 'express';
import { createCompany, deactivateCompany, fetchCompanies, getCompanyById, updateCompany } from '../controller/company.controller';

const router = express.Router();

router.post('/company/create', createCompany);
router.get('/company/:companyId', getCompanyById);
router.get('/company', fetchCompanies);
router.patch('/company/:companyId', updateCompany);
router.patch('/company/deactivate/:companyId', deactivateCompany);

export default router;
