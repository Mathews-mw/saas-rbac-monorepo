import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import { env } from '@saas/env';
import { errorHandler } from './error-handler';
import { getProfile } from './routes.ts/auth/get-profile';
import { createAccount } from './routes.ts/auth/create-account';
import { getMembership } from './routes.ts/orgs/get-membership';
import { getOrganization } from './routes.ts/orgs/get-organization';
import { createProject } from './routes.ts/projects/create-project';
import { getOrganizations } from './routes.ts/orgs/get-organizations';
import { createOrganization } from './routes.ts/orgs/create-organization';
import { updateOrganization } from './routes.ts/orgs/update-organization';
import { deleteOrganization } from './routes.ts/orgs/shutdown-organization';
import { authenticateWithGithub } from './routes.ts/auth/authenticate-with-github';
import { requestPasswordRecover } from './routes.ts/auth/request-password-recover';
import { authenticateWithPassword } from './routes.ts/auth/authenticate-with-password';
import { transferOrganization } from './routes.ts/orgs/transfer-organization';
import { deleteProject } from './routes.ts/projects/delete-project';

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
app.register(createAccount);
app.register(authenticateWithGithub);
app.register(authenticateWithPassword);
app.register(requestPasswordRecover);
app.register(getProfile);

// Organizations routes
app.register(createOrganization);
app.register(updateOrganization);
app.register(transferOrganization);
app.register(deleteOrganization);
app.register(getMembership);
app.register(getOrganizations);
app.register(getOrganization);

// Project routes
app.register(createProject);
app.register(deleteProject);

app.listen({ port: env.API_SERVER_PORT }).then(() => {
	console.log(`Server is running and listening on port ${env.API_SERVER_PORT}`);
});
