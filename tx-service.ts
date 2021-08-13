import { sendEmail } from './email-service';
import { v4 } from 'uuid';
import ctx from './logger';
import { sleep } from './utils';

export const createTX = async () => {
	const logger = ctx.getLogger(); 

	logger.info('Creating tx...', { service: 'tx-service'});

	await sleep(1000);

	const txId = v4();

	logger.info(`Created tx ${txId}`, { service: 'tx-service'});

	ctx.spawnLogger({ txId });

	await sendEmail();

	ctx.end();
};