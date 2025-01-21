import { ZodError } from 'zod';
import { FastifyInstance } from 'fastify/types/instance';
import { BadRequestError } from './routes.ts/_errors/bad-request-errors';
import { UnauthorizedError } from './routes.ts/_errors/unauthorized-error';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: 'Validation error',
			errors: error.flatten().fieldErrors,
		});
	}

	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: 'Validation Error',
			errors: error.validation.map((error) => error.params.issue),
		});
	}

	if (error instanceof BadRequestError) {
		return reply.status(400).send({
			message: error.message,
		});
	}

	if (error instanceof UnauthorizedError) {
		return reply.status(401).send({
			message: error.message,
		});
	}

	console.error('Unexpected error: ', error);

	return reply.status(500).send({ message: 'Internal server error' });
};
