import express from 'express';
import accountRoute from './account.routes';

const router = express.Router();

router.use('/v1', accountRoute);

export default router;
