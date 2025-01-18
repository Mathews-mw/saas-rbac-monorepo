import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { createAccount } from './routes.ts/auth/create-account';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { authenticateWithPassword } from './routes.ts/auth/authenticate-with-password';
import fastifyJwt from '@fastify/jwt';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

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

app.listen({ port: 3333 }).then(() => {
	console.log('Server is running and listening on port 3333');
});
