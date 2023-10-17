import Joi from 'joi';

const transferFundValidation = {
  body: Joi.object().keys({
    accountNumber: Joi.string().required(),
    amount: Joi.number().required(),
    message: Joi.string().optional(),
  }),
};

export { 
    transferFundValidation
};
