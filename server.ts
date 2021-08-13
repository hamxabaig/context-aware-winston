import winston, { Logger } from 'winston';
import { AsyncLocalStorage } from 'async_hooks';
import ctx from './logger';
import { createTX } from './tx-service';

const asyncLocalStorage = new AsyncLocalStorage<Logger>();


const execRequest = async (id: number) => {
	const logger = ctx.getLogger();
	logger.info('Calling to create tx');
	await createTX();
	logger.info('Request ended');
}

const start = async () => {
	// Mimicking requests sent by clients
	const promises = [];
	for (let i = 1; i <= 1; i++) {
		const promise = async () => {
			ctx.runInContext(async () => {
				ctx.spawnLogger({ requestId: i, service: 'server' });

				await execRequest(i);

				ctx.end();
			});
		};
		promises.push(promise());
	}

	await Promise.all(promises);
};

start();
