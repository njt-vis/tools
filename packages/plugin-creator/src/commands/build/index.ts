import logger from '../../utils/logger';
import { buildForEnv } from '../../utils/build';

async function execBuild(_options: CommandOptions): Promise<any> {
  logger.info('Start build: ');
  console.log('\n');

  await buildForEnv({ mode: 'production' });

  console.log('\n');
  logger.info('All build.');
}

export default execBuild;
