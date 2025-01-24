import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { BadRequestError } from '../_errors/bad-request-errors';
import { getUserPermissions } from '@/utils/get-user-permissions';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function getProject(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.get(
			'/organizations/:orgSlug/projects/:projectSlug',
			{
				schema: {
					tags: ['projects'],
					summary: 'Get project details.',
					security: [{ bearerAuth: [] }],
					params: z.object({
						orgSlug: z.string(),
						projectSlug: z.string(),
					}),
					response: {
						200: z.object({
							project: z.object({
								name: z.string(),
								id: z.string().uuid(),
								organizationId: z.string().uuid(),
								slug: z.string(),
								avatarUrl: z.string().url().nullable(),
								ownerId: z.string().uuid(),
								description: z.string(),
								owner: z.object({
									name: z.string().nullable(),
									id: z.string().uuid(),
									avatarUrl: z.string().url().nullable(),
								}),
							}),
						}),
					},
				},
			},
			async (request, reply) => {
				const { orgSlug, projectSlug } = request.params;

				const userId = await request.getCurrentUserId();
				const { membership, organization } = await request.getUserMembership(orgSlug);

				const { cannot } = getUserPermissions(userId, membership.role);

				if (cannot('get', 'Project')) {
					throw new UnauthorizedError(`You're not allowed to see this project`);
				}

				const project = await prisma.project.findUnique({
					select: {
						id: true,
						name: true,
						description: true,
						slug: true,
						ownerId: true,
						avatarUrl: true,
						organizationId: true,
						owner: {
							select: {
								id: true,
								name: true,
								avatarUrl: true,
							},
						},
					},
					where: {
						slug: projectSlug,
						organizationId: organization.id,
					},
				});

				if (!project) {
					throw new BadRequestError('Project not found');
				}

				return reply.send({ project });
			}
		);
}
