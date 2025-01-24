import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import { env } from '@saas/env';
import { errorHandler } from './error-handler';
import { getProfile } from './routes.ts/auth/get-profile';
import { getInvite } from './routes.ts/invites/get-invite';
import { getInvites } from './routes.ts/invites/get-invites';
import { getMembers } from './routes.ts/members/get-members';
import { getProject } from './routes.ts/projects/get-project';
import { getMembership } from './routes.ts/orgs/get-membership';
import { createAccount } from './routes.ts/auth/create-account';
import { getProjects } from './routes.ts/projects/get-projects';
import { updateMember } from './routes.ts/members/update-member';
import { removeMember } from './routes.ts/members/remove-member';
import { createInvite } from './routes.ts/invites/create-invite';
import { acceptInvite } from './routes.ts/invites/accept-invite';
import { rejectInvite } from './routes.ts/invites/reject-invite';
import { revokeInvite } from './routes.ts/invites/revoke-invite';
import { updateProject } from './routes.ts/projects/update-project';
import { getOrganization } from './routes.ts/orgs/get-organization';
import { createProject } from './routes.ts/projects/create-project';
import { deleteProject } from './routes.ts/projects/delete-project';
import { getOrganizations } from './routes.ts/orgs/get-organizations';
import { createOrganization } from './routes.ts/orgs/create-organization';
import { updateOrganization } from './routes.ts/orgs/update-organization';
import { getPendingInvites } from './routes.ts/invites/get-pending-invites';
import { deleteOrganization } from './routes.ts/orgs/shutdown-organization';
import { transferOrganization } from './routes.ts/orgs/transfer-organization';
import { authenticateWithGithub } from './routes.ts/auth/authenticate-with-github';
import { requestPasswordRecover } from './routes.ts/auth/request-password-recover';
import { getOrganizationBilling } from './routes.ts/billing/get-organization-billing';
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
app.register(updateProject);
app.register(deleteProject);
app.register(getProject);
app.register(getProjects);

// Members routes
app.register(updateMember);
app.register(removeMember);
app.register(getMembers);

// create Invites
app.register(createInvite);
app.register(acceptInvite);
app.register(rejectInvite);
app.register(revokeInvite);
app.register(getInvite);
app.register(getInvites);
app.register(getPendingInvites);

// Billing routes
app.register(getOrganizationBilling);

app.listen({ port: env.API_SERVER_PORT }).then(() => {
	console.log(`Server is running and listening on port ${env.API_SERVER_PORT}`);
});
