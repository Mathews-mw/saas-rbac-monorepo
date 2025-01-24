import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { roleSchema } from '@saas/auth/src/roles';
import { BadRequestError } from '../_errors/bad-request-errors';
import { getUserPermissions } from '@/utils/get-user-permissions';
import { UnauthorizedError } from '../_errors/unauthorized-error';
import { authMiddleware } from '@/http/middlewares/auth-middleware';

export async function createInvite(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(authMiddleware)
		.post(
			'/organizations/:slug/invites',
			{
				schema: {
					tags: ['invites'],
					summary: 'Create a new invite',
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					body: z.object({
						email: z.string().email(),
						role: roleSchema,
					}),
					response: {
						201: z.object({
							inviteId: z.string().uuid(),
						}),
					},
				},
			},
			async (request, reply) => {
				const { slug } = request.params;
				const { email, role } = request.body;

				const userId = await request.getCurrentUserId();
				const { membership, organization } = await request.getUserMembership(slug);

				const { cannot } = getUserPermissions(userId, membership.role);

				if (cannot('create', 'Invite')) {
					throw new UnauthorizedError(`You're not allowed to create invites`);
				}

				const [, domain] = email.split('@');

				if (organization.shouldAttachUsersByDomain && organization.domain === domain) {
					throw new BadRequestError(`User with ${domain} will join your organization automatically on login`);
				}

				const inviteWithSameEmail = await prisma.invite.findUnique({
					where: {
						email_organizationId: {
							email,
							organizationId: organization.id,
						},
					},
				});

				if (inviteWithSameEmail) {
					throw new BadRequestError('Another invite with same e-mail already exists');
				}

				const memberWithSameEmail = await prisma.member.findFirst({
					where: {
						organizationId: organization.id,
						user: {
							email,
						},
					},
				});

				if (memberWithSameEmail) {
					throw new BadRequestError('A member with this e-mail belongs to your organization');
				}

				const invite = await prisma.invite.create({
					data: {
						email,
						role,
						organizationId: organization.id,
						authorId: userId,
					},
				});

				return reply.status(201).send({
					inviteId: invite.id,
				});
			}
		);
}
