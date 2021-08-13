import ctx from './logger'
import { sleep } from './utils';

export const sendEmail = async () => {
	const logger = ctx.getLogger();

	logger.info('Sending email', { service: 'email-service'});

	await sleep(1000);

	logger.info('Email sent successfully', { service: 'email-service'});
}