import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { roleSchema } from '@saas/auth/src/roles';
import { BadRequestError } from '../_errors/bad-request-errors';

export async function getInvite(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/invites',
		{
			schema: {
				tags: ['invites'],
				summary: 'Get invite details',
				params: z.object({
					inviteId: z.string().uuid(),
				}),
				response: {
					200: z.object({
						invite: z.object({
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
						}),
					}),
				},
			},
		},

		async (request, reply) => {
			const { inviteId } = request.params;

			const invite = await prisma.invite.findUnique({
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
					id: inviteId,
				},
			});

			if (!invite) {
				throw new BadRequestError('Invite not found');
			}

			return reply.send({
				invite,
			});
		}
	);
}
