import * as bcrypt from 'bcrypt';
import { HashPassword, ComparePassword } from './types';

export const hashPassword: HashPassword = async (password) => {
  const saltRounds = 10;

  try {
    const hashPass = await bcrypt.hash(password, saltRounds);
    return hashPass;
  } catch (error) {
    console.log('hashed password', error);
    throw error;
  }
};

export const comparePassword: ComparePassword = async (hashPassword, password) => {
  const compareHash = await bcrypt.compare(password, hashPassword);
  return compareHash;
};
