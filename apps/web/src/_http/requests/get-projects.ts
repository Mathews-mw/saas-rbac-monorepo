import { api } from '@/_http/api-client';

interface IResponse {
	projects: Array<{
		name: string;
		id: string;
		organizationId: string;
		slug: string;
		avatarUrl: string | null;
		createdAt: string;
		ownerId: string;
		description: string;
		owner: {
			name: string | null;
			id: string;
			avatarUrl: string | null;
		};
	}>;
}

interface IRequest {
	org: string;
}

export async function getProjects({ org }: IRequest): Promise<IResponse> {
	const response = await api.get(`organizations/${org}/projects`).json<IResponse>();

	return response;
}
