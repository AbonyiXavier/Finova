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

const router = express.Router();

router.post('/card/create', createCard);
router.get('/card/:cardId', getCardById);
router.patch('/card/:cardId', activateCard);
router.patch('/card/pin/:cardId', updateCardPin);
router.get('/card/pending/:companyId', getPendingCardsByCompanyId);
router.get('/card/activated/:companyId', getActivatedCardsByCompanyId);
router.patch('/card/setlimit/:cardId', setCardSpendingLimit);

export default router;
