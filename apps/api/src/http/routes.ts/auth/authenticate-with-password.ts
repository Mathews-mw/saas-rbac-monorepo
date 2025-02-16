import z from 'zod';
import bcrypt from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { prisma } from '@/lib/prisma';
import { BadRequestError } from '../_errors/bad-request-errors';
import { UnauthorizedError } from '../_errors/unauthorized-error';

export async function authenticateWithPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/sessions/password',
		{
			schema: {
				tags: ['auth'],
				summary: 'Authenticate with email and password.',
				body: z.object({
					email: z.string().email(),
					password: z.string(),
				}),
				response: {
					201: z.object({
						token: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const userFromEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!userFromEmail) {
				throw new UnauthorizedError('Unauthorized');
			}

			if (userFromEmail.passwordHash === null) {
				throw new BadRequestError('User does not have a password. Please, use social login');
			}

			const isValidPassword = await bcrypt.compare(password, userFromEmail.passwordHash);

			if (!isValidPassword) {
				throw new UnauthorizedError('Unauthorized');
			}

			const token = await reply.jwtSign(
				{
					sub: userFromEmail.id,
				},
				{
					expiresIn: '7d',
				}
			);

			return reply.status(200).send({ token });
		}
	);
}
