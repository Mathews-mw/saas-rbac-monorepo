import { Role } from '@saas/auth';

import { api } from '@/_http/api-client';

interface IResponse {
	membership: {
		id: string;
		role: Role;
		userId: string;
		organizationId: string;
	};
}

export async function getMembership(org: string): Promise<IResponse> {
	const response = await api.get(`organizations/${org}/membership`).json<IResponse>();

	return response;
}
