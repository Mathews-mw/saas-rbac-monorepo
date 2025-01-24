import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { roleSchema } from '@saas/auth/src/roles';
import { BadRequestError } from '../_errors/bad-request-errors';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function getPendingInvites(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.get(
			'/pending-invites',
			{
				schema: {
					tags: ['invites'],
					summary: 'Get all user pending invites',
					security: [{ bearerAuth: [] }],
					response: {
						200: z.object({
							invites: z.array(
								z.object({
									id: z.string(),
									email: z.string(),
									role: roleSchema,
									createdAt: z.date(),
									author: z
										.object({
											id: z.string(),
											name: z.string().nullable(),
											avatarUrl: z.string().nullable(),
										})
										.nullable(),
									organization: z.object({
										name: z.string(),
									}),
								})
							),
						}),
					},
				},
			},

			async (request, reply) => {
				const userId = await request.getCurrentUserId();

				const user = await prisma.user.findUnique({
					where: {
						id: userId,
					},
				});

				if (!user) {
					throw new BadRequestError('User not found');
				}

				const invites = await prisma.invite.findMany({
					select: {
						id: true,
						email: true,
						role: true,
						createdAt: true,
						author: {
							select: {
								id: true,
								name: true,
								avatarUrl: true,
							},
						},
						organization: {
							select: {
								name: true,
							},
						},
					},
					where: {
						email: user.email,
					},
				});

				return reply.send({ invites });
			}
		);
}
