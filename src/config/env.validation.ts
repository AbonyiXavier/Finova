import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config();

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVariables = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),
    PORT: Joi.number().positive().required(),
    DATABASE_CREDENTIALS: Joi.string().required().description('Mongo DB url'),
  })
  .unknown();

const { value: envVariable, error } = envVariables.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  NODE_ENV: envVariable.NODE_ENV,
  PORT: envVariable.PORT,
  mongodb: envVariable.DATABASE_CREDENTIALS,
};
