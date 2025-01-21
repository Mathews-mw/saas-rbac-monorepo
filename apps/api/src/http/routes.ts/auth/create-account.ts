import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { BadRequestError } from '../_errors/bad-request-errors';

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/users',
		{
			schema: {
				tags: ['auth'],
				summary: 'Create a new account',
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(6),
				}),
			},
		},
		async (request, reply) => {
			const { email, password, name } = request.body;

			const userWithSameEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (userWithSameEmail) {
				throw new BadRequestError('User with same e-mail already exists');
			}

			const [, domain] = email.split('@');

			const autoJoinOrganization = await prisma.organization.findFirst({
				where: {
					domain,
					shouldAttachUsersByDomain: true,
				},
			});

			const passwordHash = await bcrypt.hash(password, 6);

			await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
					member_on: autoJoinOrganization
						? {
								create: {
									organizationId: autoJoinOrganization.id,
								},
							}
						: undefined,
				},
			});

			return reply.status(201).send();
		}
	);
}
