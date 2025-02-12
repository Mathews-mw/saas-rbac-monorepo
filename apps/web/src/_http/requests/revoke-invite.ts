import { api } from '@/_http/api-client';

interface IRequest {
	orgSlug: string;
	inviteId: string;
}

export async function revokeInvite({ orgSlug, inviteId }: IRequest): Promise<void> {
	await api.delete(`organizations/${orgSlug}/invites/${inviteId}`);
}
