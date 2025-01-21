import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { UnauthorizedError } from '../routes.ts/_errors/unauthorized-error';

export const authMiddleware = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook('preHandler', async (request) => {
		request.getCurrentUserId = async () => {
			try {
				const jwtPayload = await request.jwtVerify<{ sub: string }>();

				return jwtPayload.sub;
			} catch {
				throw new UnauthorizedError('Invalid auth token');
			}
		};
	});
});
