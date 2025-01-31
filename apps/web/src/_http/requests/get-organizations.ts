import { api } from '@/_http/api-client';

interface IResponse {
	organizations: Array<{
		id: string;
		name: string;
		slug: string;
		avatarUrl: string | null;
	}>;
}

export async function getOrganizations(): Promise<IResponse> {
	const response = await api.get('organizations').json<IResponse>();

	return response;
}
