import { createConnection } from 'typeorm';
import AppDataSource from '../../ormconfig';

import logger from '../common/shared/logger';

export const initializeDBConnection = async (): Promise<void> => {
  try {
    await createConnection(AppDataSource);
    logger.info('Database successfully initialized');
  } catch (error) {
    logger.error('Failed to initialize database:', error);
  }
};
