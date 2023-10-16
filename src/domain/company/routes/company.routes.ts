import express from 'express';
import { signup, deactivateCompany, fetchCompanies, getCompanyById, updateCompany, login, changePassword } from '../controller/company.controller';
import { validateCompanyToken } from '../../../common/middleware/verifyToken';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.patch('/company/changepassword', [validateCompanyToken], changePassword);
router.get('/company/:companyId', [validateCompanyToken], getCompanyById);
router.get('/company', [validateCompanyToken], fetchCompanies);
router.patch('/company/:companyId', [validateCompanyToken], updateCompany);
router.patch('/company/deactivate/:companyId', [validateCompanyToken], deactivateCompany);

export default router;
