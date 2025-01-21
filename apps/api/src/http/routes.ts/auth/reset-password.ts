import z from 'zod';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/http/middlewares/auth-middleware';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function resetPassword(app: FastifyInstance) {
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
						code: z.string(),
						password: z.string().min(6),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { code, password } = request.body;

				const token = await prisma.token.findUnique({
					where: {
						id: code,
					},
				});

				if (!token) {
					throw new UnauthorizedError('Invalid token!');
				}

				const passwordHash = await hash(password, 6);

				await prisma.user.update({
					data: {
						passwordHash,
					},
					where: {
						id: token.userId,
					},
				});

				return reply.status(204).send();
			}
		);
}
