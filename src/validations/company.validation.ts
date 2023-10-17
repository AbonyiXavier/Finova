import Joi from 'joi';
import { uuidValidator } from '../common/modifier';

const createCompanyValidation = {
  body: Joi.object().keys({
    companyName: Joi.string().required(),
    email: Joi.string().required().email(),
    companyAddress: Joi.string().required(),
    yearFounded: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const loginCompanyValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const changePasswordValidation = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

const companyByIdValidation = {
  params: Joi.object().keys({
    companyId: Joi.required().custom(uuidValidator),
  }),
};

const updateCompanyValidation = {
  params: Joi.object().keys({
    companyId: Joi.required().custom(uuidValidator),
  }),
  body: Joi.object()
    .keys({
      companyName: Joi.string().optional(),
      companyAddress: Joi.string().optional(),
      yearFounded: Joi.string().optional(),
    })
    .min(1),
};

export { 
    createCompanyValidation, 
    loginCompanyValidation, 
    changePasswordValidation, 
    companyByIdValidation, 
    updateCompanyValidation 
};
