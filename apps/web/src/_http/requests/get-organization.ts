import { api } from '@/_http/api-client';

interface IResponse {
	organization: {
		name: string;
		id: string;
		slug: string;
		domain: string | null;
		shouldAttachUsersByDomain: boolean;
		avatarUrl: string | null;
		createdAt: string;
		updatedAt: string;
		ownerId: string;
	};
}

export async function getOrganization(orgSlug: string): Promise<IResponse> {
	const response = await api.get(`organizations/${orgSlug}`).json<IResponse>();

	return response;
}
