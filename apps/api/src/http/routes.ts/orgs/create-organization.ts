import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { BadRequestError } from '../_errors/bad-request-errors';
import { authMiddleware } from '@/http/middlewares/auth-middleware';
import { generateSlugFromText } from '@/utils/generate-slug-from-text';

export async function createOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.post(
			'/organizations',
			{
				schema: {
					tags: ['organizations'],
					summary: 'Create a new organization',
					security: [{ bearerAuth: [] }],
					body: z.object({
						name: z.string(),
						domain: z.string().nullish(),
						should_attach_user_by_domain: z.optional(z.boolean()),
					}),
					response: {
						201: z.object({
							organization_id: z.string().uuid(),
						}),
					},
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId();
				const { name, domain, should_attach_user_by_domain } = request.body;

				if (domain) {
					const organizationByDomain = await prisma.organization.findUnique({
						where: {
							domain,
						},
					});

					if (organizationByDomain) {
						throw new BadRequestError('Another organization with same domain already exists');
					}
				}

				const slug = generateSlugFromText(name);

				const organization = await prisma.organization.create({
					data: {
						name,
						slug,
						domain,
						shouldAttachUsersByDomain: should_attach_user_by_domain,
						ownerId: userId,
						members: {
							create: {
								userId,
								role: 'ADMIN',
							},
						},
					},
				});

				return reply.status(201).send({
					organization_id: organization.id,
				});
			}
		);
}
