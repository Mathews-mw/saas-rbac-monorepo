import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { roleSchema } from '@saas/auth/src/roles';
import { getUserPermissions } from '@/utils/get-user-permissions';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function updateMember(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.put(
			'/organizations/:slug/members/:memberId',
			{
				schema: {
					tags: ['members'],
					summary: 'Update a member role.',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
						memberId: z.string().uuid(),
					}),
					body: z.object({
						role: roleSchema,
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { slug, memberId } = request.params;
				const { role } = request.body;

				const userId = await request.getCurrentUserId();
				const { membership, organization } = await request.getUserMembership(slug);

				const { cannot } = getUserPermissions(userId, membership.role);

				if (cannot('update', 'User')) {
					throw new UnauthorizedError(`You're not allowed to update this member`);
				}

				await prisma.member.update({
					data: {
						role,
					},
					where: {
						id: memberId,
						organizationId: organization.id,
					},
				});

				return reply.status(204).send();
			}
		);
}
