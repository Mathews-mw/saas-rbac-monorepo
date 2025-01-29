import { cookies as nextCookies } from 'next/headers';

export async function isAuthenticated() {
	const cookies = await nextCookies();

	return !!cookies.get('token')?.value;
}
