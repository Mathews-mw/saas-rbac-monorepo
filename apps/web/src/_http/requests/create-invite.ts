import { api } from '@/_http/api-client';
import { Role } from '@saas/auth';

interface IRequest {
	orgSlug: string;
	email: string;
	role: Role;
}

export async function createInvite({ orgSlug, email, role }: IRequest): Promise<void> {
	await api.post(`organizations/${orgSlug}/invites`, {
		json: {
			email,
			role,
		},
	});
}
