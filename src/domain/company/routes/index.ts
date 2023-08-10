import express from 'express';
import companyRoute from './company.routes';

const router = express.Router();

router.use('/v1', companyRoute);

export default router;
