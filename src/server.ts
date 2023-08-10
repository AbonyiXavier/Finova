import app from './index';

import logger from './common/shared/logger';

const PORT = process.env.PORT ?? 2080;

app.listen(PORT, () => {
  logger.info(`Server running at: http://localhost:${PORT}`);
});
