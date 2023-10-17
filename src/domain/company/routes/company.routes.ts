import express from 'express';
import { signup, deactivateCompany, fetchCompanies, getCompanyById, updateCompany, login, changePassword } from '../controller/company.controller';
import { validateCompanyToken } from '../../../common/middleware/verifyToken';
import { validationMiddleware } from '../../../common/middleware/validationMiddleware';
import { changePasswordValidation, createCompanyValidation, companyByIdValidation, loginCompanyValidation, updateCompanyValidation } from '../../../validations/company.validation';

const router = express.Router();

router.post('/signup', validationMiddleware(createCompanyValidation), signup);
router.post('/login', [validationMiddleware(loginCompanyValidation)], login);
router.patch('/company/changepassword', [validationMiddleware(changePasswordValidation), validateCompanyToken], changePassword);
router.get('/company/:companyId', [validationMiddleware(companyByIdValidation), validateCompanyToken], getCompanyById);
router.get('/company', [validateCompanyToken], fetchCompanies);
router.patch('/company/:companyId', [validationMiddleware(updateCompanyValidation), validateCompanyToken], updateCompany);
router.patch('/company/deactivate/:companyId', [validationMiddleware(companyByIdValidation), validateCompanyToken], deactivateCompany);

export default router;
