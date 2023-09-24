import jwt from 'jsonwebtoken';
import { GenerateJwtToken, VerifyJwtToken } from './types';

export const generateJwtToken: GenerateJwtToken = async (payload) => {
  const secret = `${process.env.JWT_SECRET_KEY}`;
  const token = jwt.sign({ payload }, secret, { expiresIn: `${process.env.JWT_EXPIRE_TIME}` });
  return token;
};

export const verifyJwtToken: VerifyJwtToken = (token) => {
  const secret = `${process.env.JWT_SECRET_KEY}`;
  return jwt.verify(token, secret);
};
