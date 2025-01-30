'use server';

import { z } from 'zod';
import { HTTPError } from 'ky';
import { cookies as nextCookies } from 'next/headers';

import { signInWithCredentials } from '@/_http/requests/sign-in-with-credentials';

const signInSchema = z.object({
	email: z.string().email({ message: 'Please, provide a valid e-mail.' }),
	password: z.string().min(6, { message: 'At least, 6 chars.' }),
});

export async function signInWithCredentialsAction(data: FormData) {
	const parseResult = signInSchema.safeParse(Object.fromEntries(data));

	if (!parseResult.success) {
		const errors = parseResult.error.flatten().fieldErrors;

		return { success: false, message: null, errors };
	}

	const { email, password } = parseResult.data;

	try {
		const { token } = await signInWithCredentials({ email, password });

		const cookies = await nextCookies();

		cookies.set('token', token, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});
	} catch (error) {
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return { success: false, message, errors: null };
		}

		return { success: false, message: 'Unexpected error. Please, try again in a few minutes.', errors: null };
	}

	return { success: true, message: null, errors: null };
}
