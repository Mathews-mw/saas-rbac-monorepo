import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { roleSchema } from '@saas/auth/src/roles';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function getMembership(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.get(
			'/organizations/:slug/membership',
			{
				schema: {
					tags: ['organizations'],
					summary: 'Get user membership on organization.',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							membership: z.object({
								id: z.string().uuid(),
								userId: z.string().uuid(),
								organizationId: z.string().uuid(),
								role: roleSchema,
							}),
						}),
					},
				},
			},
			async (request, reply) => {
				const { slug } = request.params;

				const { membership } = await request.getUserMembership(slug);

				return reply.send({
					membership: {
						id: membership.id,
						userId: membership.userId,
						organizationId: membership.organizationId,
						role: membership.role,
					},
				});
			}
		);
}
