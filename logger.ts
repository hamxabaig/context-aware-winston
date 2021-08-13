import winston, { Logger } from 'winston';
import { AsyncLocalStorage } from 'async_hooks';

interface IContext {
	spawnLogger(opts: any): Logger;
	getLogger(): Logger;
	runInContext(fn: (..._: any) => any): void;
	end(): void;
}

interface IStorage {
	_old: Logger | null;
	logger: Logger;
}

const asyncLocalStorage = new AsyncLocalStorage<IStorage>();

const parentLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	],
});


const ctx = {} as IContext;

ctx.spawnLogger = (opts: any) => {
	const { logger, _old } = asyncLocalStorage.getStore()!;

	if (!logger) { 
		throw new Error('No logger found in context');
	}

	const childLogger = logger.child(opts);

	asyncLocalStorage.enterWith({
		logger: childLogger,
		_old: logger,
	});

	return childLogger;
};

ctx.getLogger = () => {
	const logger = asyncLocalStorage.getStore()!.logger;

	if (!logger) {
		throw new Error('No logger found in context');
	}

	return logger;
}

ctx.end = () => {
	const { logger, _old } = asyncLocalStorage.getStore()!;
	asyncLocalStorage.enterWith({ logger: _old!, _old: logger });
}

ctx.runInContext = (fn) => {
	const store: IStorage = {
		_old: null,
		logger: parentLogger,
	};

	asyncLocalStorage.run(store, async () => {
		await fn();
	});
}

export default ctx;
