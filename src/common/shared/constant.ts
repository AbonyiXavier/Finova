const TABLES = {
  account: 'account',
  card: 'card',
  company: 'company',
  transaction: 'transaction',
};

const DEFAULT_PIN = '5555';
const NUMBER_OF_CARD_EXPIRY_YEAR = 5;
const DEFAULT_CREDITED_BALANCE = 12000;

const SET_LIMIT_EXPIRATION = {
  DAILY_LIMIT: 1,
  WEEKLY_LIMIT: 7,
  MONTHLY_LIMIT: 30,
};

export { TABLES, DEFAULT_PIN, NUMBER_OF_CARD_EXPIRY_YEAR, DEFAULT_CREDITED_BALANCE, SET_LIMIT_EXPIRATION };
