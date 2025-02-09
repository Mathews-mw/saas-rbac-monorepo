'use server';

import { z } from 'zod';
import { HTTPError } from 'ky';

import { createProject } from '@/_http/requests/create-project';
import { getCurrentOrg } from '@/auth/auth';

const saveProjectSchema = z.object({
	name: z.string().min(4, { message: 'At least, 4 chars.' }),
	description: z.string(),
});

export async function saveProjectAction(data: FormData) {
	const parseResult = saveProjectSchema.safeParse(Object.fromEntries(data));

	if (!parseResult.success) {
		const errors = parseResult.error.flatten().fieldErrors;

		return { success: false, message: null, errors };
	}

	const { name, description } = parseResult.data;

	const orgSlug = await getCurrentOrg();

	try {
		await createProject({ orgSlug: orgSlug!, name, description });
	} catch (error) {
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return { success: false, message, errors: null };
		}

		return { success: false, message: 'Unexpected error. Please, try again in a few minutes.', errors: null };
	}

	return { success: true, message: 'Saved project with success.', errors: null };
}
