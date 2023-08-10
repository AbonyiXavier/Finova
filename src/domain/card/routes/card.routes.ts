import express from 'express';
import { createCard } from '../controller/card.controller';

const router = express.Router();

router.post('/card/create', createCard);

export default router;
