import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function requestPasswordRecover(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.post(
			'/password/recover',
			{
				schema: {
					tags: ['auth'],
					summary: 'Get Authenticate user profile.',
					body: z.object({
						email: z.string().email(),
					}),
					response: {
						201: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { email } = request.body;

				const user = await prisma.user.findUnique({
					where: {
						email,
					},
				});

				if (!user) {
					return reply.status(201).send();
				}

				const { id: token } = await prisma.token.create({
					data: {
						type: 'PASSWORD_RECOVER',
						userId: user.id,
					},
				});

				// Send an e-mail with password recover link

				console.log('Recover password token: ', token);

				return reply.status(201).send();
			}
		);
}
