import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import {
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { createAccount } from './routes.ts/auth/create-account';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);

app.register(createAccount);

app.listen({ port: 3333 }).then(() => {
	console.log('Server is running and listening on port 3333');
});
