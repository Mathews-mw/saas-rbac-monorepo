import { api } from '@/_http/api-client';

interface IRequest {
	orgSlug: string;
}

export async function shutdownOrganization({ orgSlug }: IRequest): Promise<void> {
	await api.delete(`organizations/${orgSlug}`);
}
