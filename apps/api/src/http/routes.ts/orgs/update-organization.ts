import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { BadRequestError } from '../_errors/bad-request-errors';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { getUserPermissions } from '@/utils/get-user-permissions';
import { authMiddleware } from '@/http/middlewares/auth-middleware';
import { organizationSchema } from '@saas/auth/src/models/organization';

export async function updateOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.put(
			'/organizations/:slug',
			{
				schema: {
					tags: ['organizations'],
					summary: 'Update an organization details',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					body: z.object({
						name: z.string(),
						domain: z.string().nullish(),
						should_attach_user_by_domain: z.optional(z.boolean()),
					}),
					response: {
						204: z.null(),
					},
				},
			},
			async (request, reply) => {
				const { slug } = request.params;
				const { name, domain, should_attach_user_by_domain } = request.body;

				const userId = await request.getCurrentUserId();
				const { membership, organization } = await request.getUserMembership(slug);

				const authOrganization = organizationSchema.parse(organization);

				const { cannot } = getUserPermissions(userId, membership.role);

				if (cannot('update', authOrganization)) {
					throw new UnauthorizedError("You're not allowed to update this organization");
				}

				if (domain) {
					const organizationByDomain = await prisma.organization.findFirst({
						where: {
							domain,
							id: {
								not: organization.id,
							},
						},
					});

					if (organizationByDomain) {
						throw new BadRequestError('Another organizations with same domain already exists');
					}
				}

				await prisma.organization.update({
					data: {
						name,
						domain,
						shouldAttachUsersByDomain: should_attach_user_by_domain,
					},
					where: {
						id: organization.id,
					},
				});

				return reply.status(204).send();
			}
		);
}
