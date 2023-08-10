import express from 'express';
import cardRoute from './card.routes';

const router = express.Router();

router.use('/v1', cardRoute);

export default router;
