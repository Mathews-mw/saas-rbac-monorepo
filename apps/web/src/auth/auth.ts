import { redirect } from 'next/navigation';
import { cookies, cookies as nextCookies } from 'next/headers';

import { getProfile } from '@/_http/requests/get-profile';
import { getMembership } from '@/_http/requests/get-membership';
import { defineAbilityFor } from '@saas/auth';

export async function auth() {
	const cookies = await nextCookies();

	const token = cookies.get('token')?.value;

	if (!token) {
		redirect('/auth/sign-in');
	}

	try {
		const { user } = await getProfile();

		return { user };
	} catch (error) {
		console.log('auth error: ', error);
	}

	redirect('/api/auth/sign-out');
}

export async function isAuthenticated() {
	const cookies = await nextCookies();

	return !!cookies.get('token')?.value;
}

export async function getCurrentOrg() {
	return (await cookies()).get('org')?.value ?? null;
}

export async function getCurrentMembership() {
	const org = await getCurrentOrg();

	if (!org) {
		return null;
	}

	const { membership } = await getMembership(org);

	return membership;
}

export async function ability() {
	const membership = await getCurrentMembership();

	if (!membership) {
		return null;
	}

	const ability = defineAbilityFor({
		id: membership.userId,
		role: membership.role,
	});

	return ability;
}
