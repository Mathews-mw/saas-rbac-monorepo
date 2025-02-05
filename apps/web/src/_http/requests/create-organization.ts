import { api } from '@/_http/api-client';

interface IRequest {
	name: string;
	domain: string | null;
	shouldAttachUserByDomain: boolean;
}

export async function createOrganization({ name, domain, shouldAttachUserByDomain }: IRequest): Promise<void> {
	await api.post('organizations', {
		json: {
			name,
			domain,
			shouldAttachUserByDomain,
		},
	});
}
