import { api } from '@/_http/api-client';

interface IRequest {
	orgSlug: string;
	name: string;
	description: string;
}

export async function createProject({ orgSlug, name, description }: IRequest): Promise<void> {
	await api.post(`organizations/${orgSlug}/projects`, {
		json: {
			name,
			description,
		},
	});
}
