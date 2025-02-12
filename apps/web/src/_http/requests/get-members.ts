import { Role } from '@saas/auth';

import { api } from '@/_http/api-client';

interface IResponse {
	members: {
		name: string | null;
		id: string;
		role: Role;
		userId: string;
		avatarUrl: string | null;
		email: string;
	}[];
}

export async function getMembers(org: string): Promise<IResponse> {
	const response = await api
		.get(`organizations/${org}/members`, {
			next: {
				tags: [`${org}/members`],
			},
		})
		.json<IResponse>();

	return response;
}
