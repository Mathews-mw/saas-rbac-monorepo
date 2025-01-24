import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { projectSchema } from '@saas/auth/src/models/project';
import { BadRequestError } from '../_errors/bad-request-errors';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { getUserPermissions } from '@/utils/get-user-permissions';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function updateProject(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.put(
			'/organizations/:slug/projects/:projectId',
			{
				schema: {
					tags: ['projects'],
					summary: 'Update a project',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
						projectId: z.string().uuid(),
					}),
					body: z.object({
						name: z.string(),
						description: z.string(),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { slug, projectId } = request.params;
				const { name, description } = request.body;

				const userId = await request.getCurrentUserId();
				const { membership, organization } = await request.getUserMembership(slug);

				const { cannot } = getUserPermissions(userId, membership.role);

				const project = await prisma.project.findUnique({
					where: {
						id: projectId,
						organizationId: organization.id,
					},
				});

				if (!project) {
					throw new BadRequestError('Project not found');
				}

				const authProject = projectSchema.parse(project);

				if (cannot('update', authProject)) {
					throw new UnauthorizedError(`You're not allowed to update this project`);
				}

				await prisma.project.update({
					data: {
						name,
						description,
					},
					where: {
						id: projectId,
					},
				});

				return reply.status(204).send();
			}
		);
}
