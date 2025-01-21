import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from '@saas/env';
import { errorHandler } from './error-handler';
import { getProfile } from './routes.ts/auth/get-profile';
import { createAccount } from './routes.ts/auth/create-account';
import { getMembership } from './routes.ts/orgs/get-membershit';
import { createOrganization } from './routes.ts/orgs/create-organization';
import { authenticateWithGithub } from './routes.ts/auth/authenticate-with-github';
import { requestPasswordRecover } from './routes.ts/auth/request-password-recover';
import { authenticateWithPassword } from './routes.ts/auth/authenticate-with-password';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Next.JS SaaS',
			description: 'Full-stack SaaS app with multi-tenant & RBAC.',
			version: '1.0.0',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(fastifyCors);

// Auth routes
app.register(getProfile);
app.register(createAccount);
app.register(authenticateWithGithub);
app.register(requestPasswordRecover);
app.register(authenticateWithPassword);

// Organizations routes
app.register(getMembership);
app.register(createOrganization);

app.listen({ port: env.API_SERVER_PORT }).then(() => {
	console.log(`Server is running and listening on port ${env.API_SERVER_PORT}`);
});
