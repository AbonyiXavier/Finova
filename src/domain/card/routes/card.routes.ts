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

const router = express.Router();

router.post('/card/create', [validateCompanyToken], createCard);
router.get('/card/:cardId', [validateCompanyToken], getCardById);
router.patch('/card/:cardId', [validateCompanyToken], activateCard);
router.patch('/card/pin/:cardId', [validateCompanyToken], updateCardPin);
router.get('/card/pending/:companyId', [validateCompanyToken], getPendingCardsByCompanyId);
router.get('/card/activated/:companyId', [validateCompanyToken], getActivatedCardsByCompanyId);
router.patch('/card/setlimit/:cardId', [validateCompanyToken], setCardSpendingLimit);

export default router;
