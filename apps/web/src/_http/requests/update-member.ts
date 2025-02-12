import { api } from '@/_http/api-client';
import { Role } from '@saas/auth';

interface IRequest {
	orgSlug: string;
	memberId: string;
	role: Role;
}

export async function updateMember({ orgSlug, memberId, role }: IRequest): Promise<void> {
	await api.put(`organizations/${orgSlug}/members/${memberId}`, {
		json: { role },
	});
}
