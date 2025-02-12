'use server';

import { createInvite } from '@/_http/requests/create-invite';
import { removeMember } from '@/_http/requests/remove-member';
import { revokeInvite } from '@/_http/requests/revoke-invite';
import { updateMember } from '@/_http/requests/update-member';
import { getCurrentOrg } from '@/auth/auth';
import { Role } from '@saas/auth';
import { roleSchema } from '@saas/auth/src/roles';
import { HTTPError } from 'ky';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

const saveProjectSchema = z.object({
	email: z.string().email({ message: 'Invalid e-mail address' }),
	role: roleSchema,
});

export async function createInviteAction(data: FormData) {
	const parseResult = saveProjectSchema.safeParse(Object.fromEntries(data));

	if (!parseResult.success) {
		const errors = parseResult.error.flatten().fieldErrors;

		return { success: false, message: null, errors };
	}

	const { email, role } = parseResult.data;

	const orgSlug = await getCurrentOrg();

	try {
		await createInvite({ orgSlug: orgSlug!, email, role });

		revalidateTag(`${orgSlug}/invites`);
	} catch (error) {
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return { success: false, message, errors: null };
		}

		return { success: false, message: 'Unexpected error. Please, try again in a few minutes.', errors: null };
	}

	return { success: true, message: 'Invite user with success.', errors: null };
}

export async function removeMemberAction(memberId: string) {
	const currentOrg = await getCurrentOrg();

	await removeMember({ orgSlug: currentOrg!, memberId });

	revalidateTag(`${currentOrg!}/members`);
}

export async function updateMemberAction(memberId: string, role: Role) {
	const currentOrg = await getCurrentOrg();

	await updateMember({ orgSlug: currentOrg!, memberId, role });

	revalidateTag(`${currentOrg!}/members`);
}

export async function revokeInviteAction(inviteId: string) {
	const currentOrg = await getCurrentOrg();

	await revokeInvite({ orgSlug: currentOrg!, inviteId });

	revalidateTag(`${currentOrg!}/invites`);
}
