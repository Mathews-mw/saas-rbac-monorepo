import { api } from '@/_http/api-client';
import { Role } from '@saas/auth';

interface IResponse {
	invites: {
		id: string;
		role: Role;
		createdAt: Date;
		email: string;
		author: {
			name: string | null;
			id: string;
		} | null;
	}[];
}

interface IRequest {
	org: string;
}

export async function getInvites({ org }: IRequest): Promise<IResponse> {
	const response = await api
		.get(`organizations/${org}/invites`, {
			next: {
				tags: [`${org!}/invites`],
			},
		})
		.json<IResponse>();

	return response;
}
