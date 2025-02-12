import { api } from '@/_http/api-client';

interface IRequest {
	orgSlug: string;
	memberId: string;
}

export async function removeMember({ orgSlug, memberId }: IRequest): Promise<void> {
	await api.delete(`organizations/${orgSlug}/members/${memberId}`);
}
