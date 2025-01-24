import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { authMiddleware } from '@/http/middlewares/auth-middleware';
import { roleSchema } from '@saas/auth/src/roles';

export async function getMembers(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.get(
			'/organizations/:slug/members',
			{
				schema: {
					tags: ['members'],
					summary: 'Get all organization members.',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							members: z.array(
								z.object({
									userId: z.string(),
									id: z.string(),
									role: roleSchema,
									name: z.string().nullable(),
									avatarUrl: z.string().nullable(),
									email: z.string(),
								})
							),
						}),
					},
				},
			},
			async (request, reply) => {
				const { slug } = request.params;

				const userId = await request.getCurrentUserId();
				const { membership, organization } = await request.getUserMembership(slug);

				const { cannot } = getUserPermissions(userId, membership.role);

				if (cannot('get', 'User')) {
					throw new UnauthorizedError(`You're not allowed to see organization members`);
				}

				const members = await prisma.member.findMany({
					select: {
						id: true,
						role: true,
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								avatarUrl: true,
							},
						},
					},
					where: {
						organizationId: organization.id,
					},
					orderBy: {
						role: 'asc',
					},
				});

				const membersResponse = members.map(({ user: { id: userId, ...user }, ...member }) => {
					return {
						...user,
						...member,
						userId,
					};
				});

				return reply.send({ members: membersResponse });
			}
		);
}
