import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { roleSchema } from '@saas/auth/src/roles';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function getOrganizations(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.get(
			'/organizations',
			{
				schema: {
					tags: ['organizations'],
					summary: 'Get organizations where user is a member.',
					security: [{ bearerAuth: [] }],
					response: {
						200: z.object({
							organizations: z.array(
								z.object({
									id: z.string().uuid(),
									name: z.string(),
									slug: z.string(),
									avatarUrl: z.string().nullable(),
									role: roleSchema,
								})
							),
						}),
					},
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId();

				const organizations = await prisma.organization.findMany({
					select: {
						id: true,
						name: true,
						slug: true,
						avatarUrl: true,
						members: {
							select: {
								role: true,
							},
							where: {
								userId,
							},
						},
					},
					where: {
						members: {
							some: {
								userId,
							},
						},
					},
				});

				const organizationsWithUserRole = organizations.map(({ members, ...org }) => {
					return {
						...org,
						role: members[0].role,
					};
				});

				return reply.send({ organizations: organizationsWithUserRole });
			}
		);
}
