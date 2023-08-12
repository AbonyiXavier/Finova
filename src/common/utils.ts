import bcrypt from 'bcrypt';
import { addYears } from 'date-fns';
import { NUMBER_OF_CARD_EXPIRY_YEAR } from './shared/constant';
import { checkExistingAccountNumberRepository } from '../domain/account/repository/account.repository';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomstring = require('randomstring');

const randomInteger = (length: number): number => {
  return randomstring.generate({
    length,
    charset: 'numeric',
  });
};

const generateVisaCardNumber = () => {
  const prefix = '4165';
  return `${prefix}${randomInteger(12)}`;
};

const generateMasterCardNumber = () => {
  const prefix = '5399';
  return `${prefix}${randomInteger(12)}`;
};

const generateCardCvv = () => {
  return randomInteger(3);
};

const generateAccountNumber = async () => {
  const prefix = '62';
  let accountNumberGenerated = `${prefix}${randomInteger(8)}`;

  const existingAccountNumber = await checkExistingAccountNumberRepository(accountNumberGenerated);

  if (existingAccountNumber) {
    accountNumberGenerated = `${prefix}${randomInteger(8)}`;
  }

  checkExistingAccountNumberRepository(accountNumberGenerated);
  return accountNumberGenerated;
};

const encryptCardPin = async (pin: string) => {
  const encryptPin = await bcrypt.hash(pin, bcrypt.genSaltSync(10));
  return encryptPin;
};

const computeCardExpiryYear = (date: Date) => {
  const todayDate = new Date(date);
  return addYears(new Date(todayDate), NUMBER_OF_CARD_EXPIRY_YEAR);
};

const validatePin = (pin: string): boolean => {
  const pinRegex = /^\d{4}$/; // Regular expression for a 4-digit number

  return pinRegex.test(pin);
};
export {
  generateVisaCardNumber,
  generateMasterCardNumber,
  generateAccountNumber,
  encryptCardPin,
  computeCardExpiryYear,
  generateCardCvv,
  validatePin,
};
