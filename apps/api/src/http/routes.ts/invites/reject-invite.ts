import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { BadRequestError } from '../_errors/bad-request-errors';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function rejectInvite(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.post(
			'/invites/:inviteId/reject',
			{
				schema: {
					tags: ['invites'],
					summary: 'Reject an invite',
					security: [{ bearerAuth: [] }],
					params: z.object({
						inviteId: z.string().uuid(),
					}),
					response: {
						204: z.null(),
					},
				},
			},

			async (request, reply) => {
				const { inviteId } = request.params;
				const userId = await request.getCurrentUserId();

				const invite = await prisma.invite.findUnique({
					where: {
						id: inviteId,
					},
				});

				if (!invite) {
					throw new BadRequestError('Invite not found or expired');
				}

				const user = await prisma.user.findUnique({
					where: {
						id: userId,
					},
				});

				if (!user) {
					throw new BadRequestError('This invite belongs to another user');
				}

				await prisma.invite.delete({
					where: {
						id: invite.id,
					},
				});

				return reply.status(204).send();
			}
		);
}
