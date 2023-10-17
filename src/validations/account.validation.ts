import Joi from 'joi';
import { uuidValidator } from '../common/modifier';

const createAccountValidation = {
  body: Joi.object().keys({
    companyId: Joi.string().required(),
  }),
};

const getAccountByIdValidation = {
  params: Joi.object().keys({
    companyId: Joi.required().custom(uuidValidator),
  }),
};

export { 
    createAccountValidation, 
    getAccountByIdValidation,
};
