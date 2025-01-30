'use server';

import { z } from 'zod';
import { HTTPError } from 'ky';

import { signUp } from '@/_http/requests/sign-up';

const signUpSchema = z
	.object({
		name: z.string().refine((value) => value.split(' ').length > 1, { message: 'Please, enter your full name' }),
		email: z.string().email({ message: 'Please, provide a valid e-mail.' }),
		password: z.string().min(6, { message: 'At least 6 characters.' }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Password confirmation does not match',
		path: ['confirmPassword'],
	});

export async function signUpAction(data: FormData) {
	const parseResult = signUpSchema.safeParse(Object.fromEntries(data));

	if (!parseResult.success) {
		const errors = parseResult.error.flatten().fieldErrors;

		return { success: false, message: null, errors };
	}

	const { name, email, password } = parseResult.data;

	try {
		await signUp({ name, email, password });
	} catch (error) {
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return { success: false, message, errors: null };
		}

		return { success: false, message: 'Unexpected error. Please, try again in a few minutes.', errors: null };
	}

	return { success: true, message: null, errors: null };
}
