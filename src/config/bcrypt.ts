import * as bcrypt from 'bcrypt';
import { HashPassword, ComparePassword } from './types';

export const hashPassword: HashPassword = async (password) => {
  const hashPass = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  return hashPass;
};

export const comparePassword: ComparePassword = async (hashPassword, password) => {
  const compareHash = await bcrypt.compare(password, hashPassword);
  return compareHash;
};
