import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function removeMember(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.delete(
			'/organizations/:slug/members/:memberId',
			{
				schema: {
					tags: ['members'],
					summary: 'Remover a member from the organization.',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
						memberId: z.string().uuid(),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { slug, memberId } = request.params;

				const userId = await request.getCurrentUserId();
				const { membership, organization } = await request.getUserMembership(slug);

				const { cannot } = getUserPermissions(userId, membership.role);

				if (cannot('update', 'User')) {
					throw new UnauthorizedError(`You're not allowed to remover this member from the organization`);
				}

				await prisma.member.delete({
					where: {
						id: memberId,
						organizationId: organization.id,
					},
				});

				return reply.status(204).send();
			}
		);
}
