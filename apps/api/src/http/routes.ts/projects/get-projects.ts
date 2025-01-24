import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { getUserPermissions } from '@/utils/get-user-permissions';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function getProjects(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.get(
			'/organizations/:slug/projects',
			{
				schema: {
					tags: ['projects'],
					summary: 'Get all projects organization.',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							projects: z.array(
								z.object({
									name: z.string(),
									id: z.string().uuid(),
									organizationId: z.string().uuid(),
									slug: z.string(),
									avatarUrl: z.string().url().nullable(),
									ownerId: z.string().uuid(),
									description: z.string(),
									createdAt: z.date(),
									owner: z.object({
										name: z.string().nullable(),
										id: z.string().uuid(),
										avatarUrl: z.string().url().nullable(),
									}),
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

				if (cannot('get', 'Project')) {
					throw new UnauthorizedError(`You're not allowed to see organization projects`);
				}

				const projects = await prisma.project.findMany({
					select: {
						id: true,
						name: true,
						description: true,
						slug: true,
						ownerId: true,
						avatarUrl: true,
						organizationId: true,
						createdAt: true,
						owner: {
							select: {
								id: true,
								name: true,
								avatarUrl: true,
							},
						},
					},
					where: {
						organizationId: organization.id,
					},
					orderBy: {
						createdAt: 'desc',
					},
				});

				return reply.send({ projects });
			}
		);
}
