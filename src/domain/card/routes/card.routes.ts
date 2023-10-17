import express from 'express';
import {
  activateCard,
  createCard,
  getActivatedCardsByCompanyId,
  getCardById,
  getPendingCardsByCompanyId,
  setCardSpendingLimit,
  updateCardPin,
} from '../controller/card.controller';
import { validateCompanyToken } from '../../../common/middleware/verifyToken';
import { validationMiddleware } from '../../../common/middleware/validationMiddleware';
import { createCardValidation, cardByIdValidation, updateCardPinValidation, setCardSpendingLimitValidation } from '../../../validations/card.validtion';
import { companyByIdValidation } from '../../../validations/company.validation';

const router = express.Router();

router.post('/card/create', [validationMiddleware(createCardValidation), validateCompanyToken], createCard);
router.get('/card/:cardId', [validationMiddleware(cardByIdValidation), validateCompanyToken], getCardById);
router.patch('/card/:cardId', [validationMiddleware(cardByIdValidation), validateCompanyToken], activateCard);
router.patch('/card/pin/:cardId', [validationMiddleware(updateCardPinValidation), validateCompanyToken], updateCardPin);
router.get('/card/pending/:companyId', [validationMiddleware(companyByIdValidation), validateCompanyToken], getPendingCardsByCompanyId);
router.get('/card/activated/:companyId', [validationMiddleware(companyByIdValidation), validateCompanyToken], getActivatedCardsByCompanyId);
router.patch('/card/setlimit/:cardId', [validationMiddleware(setCardSpendingLimitValidation), validateCompanyToken], setCardSpendingLimit);

export default router;
