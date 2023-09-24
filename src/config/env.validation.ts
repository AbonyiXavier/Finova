import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config();

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVariables = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),
    PORT: Joi.number().positive().required(),
    DATABASE_CREDENTIALS: Joi.string().required().description('DATABASE_CREDENTIALS'),
    JWT_SECRET_KEY: Joi.string().required().description('JWT_SECRET_KEY'),
    JWT_EXPIRE_TIME: Joi.string().required().description('JWT_EXPIRE_TIME'),
  })
  .unknown();

const { value: envVariable, error } = envVariables.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  NODE_ENV: envVariable.NODE_ENV,
  PORT: envVariable.PORT,
  DATABASE_CREDENTIALS: envVariable.DATABASE_CREDENTIALS,
  JWT_SECRET_KEY: envVariable.JWT_SECRET_KEY,
  JWT_EXPIRE_TIME: envVariable.JWT_EXPIRE_TIME,
};
