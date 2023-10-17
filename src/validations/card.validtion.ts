import Joi from 'joi';
import { uuidValidator } from '../common/modifier';
import { CardType, SpendingLimitInterval } from '../domain/card/enums';

const createCardValidation = {
  body: Joi.object().keys({
    cardType: Joi.string().valid(CardType.MASTER, CardType.VISA).required(),
    accountId: Joi.string().custom(uuidValidator).required(),
  }),
};

const cardByIdValidation = {
  params: Joi.object().keys({
    cardId: Joi.required().custom(uuidValidator),
  }),
};

const updateCardPinValidation = {
  params: Joi.object().keys({
    cardId: Joi.required().custom(uuidValidator),
  }),
  body: Joi.object()
    .keys({
      pin: Joi.string().required()
    })
};

const setCardSpendingLimitValidation = {
  params: Joi.object().keys({
    cardId: Joi.required().custom(uuidValidator),
  }),
  body: Joi.object().keys({
    spendingLimit: Joi.string().required(),
    spendingLimitInterval: Joi.string().valid(SpendingLimitInterval.DAILY, SpendingLimitInterval.WEEKLY, SpendingLimitInterval.MONTHLY).required(),
  }),
};

export { 
    createCardValidation, 
    cardByIdValidation, 
    updateCardPinValidation,
    setCardSpendingLimitValidation 
};
