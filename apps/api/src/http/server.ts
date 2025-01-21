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

import { errorHandler } from './error-handler';
import { getProfile } from './routes.ts/auth/get-profile';
import { createAccount } from './routes.ts/auth/create-account';
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
		servers: [],
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
});

app.register(fastifyJwt, {
	secret: 'my-super-secret-jwt',
});

app.register(fastifyCors);

app.register(authenticateWithPassword);
app.register(createAccount);
app.register(getProfile);
app.register(requestPasswordRecover);

app.listen({ port: 3333 }).then(() => {
	console.log('Server is running and listening on port 3333');
});
