import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { env } from '@saas/env';
import { prisma } from '@/lib/prisma';
import { BadRequestError } from '../_errors/bad-request-errors';

export async function authenticateWithGithub(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/sessions/github',
		{
			schema: {
				tags: ['auth'],
				summary: 'Authenticate with Github.',
				body: z.object({
					code: z.string(),
				}),
				response: {
					201: z.object({
						token: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { code } = request.body;

			const githubOAuthURL = new URL(
				'https://github.com/login/oauth/access_token'
			);

			githubOAuthURL.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
			githubOAuthURL.searchParams.set(
				'client_secret',
				env.GITHUB_CLIENT_SECRET
			);
			githubOAuthURL.searchParams.set(
				'redirect_uri',
				env.GITHUB_CLIENT_REDIRECT_URI
			);
			githubOAuthURL.searchParams.set('code', code);

			const githubAccessTokenResponse = await fetch(githubOAuthURL, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
				},
			});

			const githubAccessTokenData = await githubAccessTokenResponse.json();

			const { access_token } = z
				.object({
					access_token: z.string(),
					token_type: z.literal('bearer'),
					scope: z.string(),
				})
				.parse(githubAccessTokenData);

			const githubUserResponse = await fetch('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			});

			const githubUserData = await githubUserResponse.json();

			const {
				id: githubId,
				avatar_url,
				name,
				email,
			} = z
				.object({
					id: z.number().int().transform(String),
					avatar_url: z.string().url(),
					name: z.string().nullable(),
					email: z.string().nullable(),
				})
				.parse(githubUserData);

			if (email === null) {
				throw new BadRequestError(
					'Your Github account must have an email authenticate'
				);
			}

			let user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!user) {
				user = await prisma.user.create({
					data: {
						name,
						email,
						avatarUrl: avatar_url,
					},
				});
			}

			let account = await prisma.account.findUnique({
				where: {
					provider_userId: {
						provider: 'GITHUB',
						userId: user.id,
					},
				},
			});

			if (!account) {
				account = await prisma.account.create({
					data: {
						provider: 'GITHUB',
						userId: user.id,
						providerAccountId: githubId,
					},
				});
			}

			const token = await reply.jwtSign(
				{
					sub: user.id,
				},
				{
					expiresIn: '7d',
				}
			);

			return reply.status(200).send({ token });
		}
	);
}
