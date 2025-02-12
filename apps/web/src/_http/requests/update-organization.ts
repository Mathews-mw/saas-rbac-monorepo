import { api } from '@/_http/api-client';

interface IRequest {
	orgSlug: string;
	name: string;
	domain: string | null;
	shouldAttachUserByDomain: boolean;
}

export async function updateOrganization({ orgSlug, name, domain, shouldAttachUserByDomain }: IRequest): Promise<void> {
	await api.put(`organizations/${orgSlug}`, {
		json: {
			name,
			domain,
			shouldAttachUserByDomain,
		},
	});
}
