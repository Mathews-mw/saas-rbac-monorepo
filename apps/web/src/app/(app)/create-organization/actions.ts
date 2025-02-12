'use server';

import { z } from 'zod';
import { HTTPError } from 'ky';

import { getCurrentOrg } from '@/auth/auth';
import { createOrganization } from '@/_http/requests/create-organization';
import { updateOrganization } from '@/_http/requests/update-organization';
import { revalidateTag } from 'next/cache';

const saveOrganizationSchema = z
	.object({
		name: z.string().min(4, { message: 'At least, 4 chars.' }),
		domain: z.string().nullable(),
		// .refine(
		// 	(value) => {
		// 		if (value) {
		// 			const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		// 			return domainRegex.test(value);
		// 		}

		// 		return true;
		// 	},
		// 	{ message: 'Please, enter a valid domain.' }
		// ),
		shouldAttachUserByDomain: z
			.union([z.literal('on'), z.literal('off'), z.boolean()])
			.transform((value) => value === true || value === 'on')
			.default(false),
	})
	.refine(
		(data) => {
			if (data.shouldAttachUserByDomain === true && !data.domain) {
				return false;
			}

			return true;
		},
		{ message: 'Domain is required when auto-join is enabled', path: ['domain'] }
	);

export type OrganizationSchema = z.infer<typeof saveOrganizationSchema>;

export async function saveOrganizationAction(data: FormData) {
	const parseResult = saveOrganizationSchema.safeParse(Object.fromEntries(data));

	if (!parseResult.success) {
		const errors = parseResult.error.flatten().fieldErrors;

		return { success: false, message: null, errors };
	}

	const { name, domain, shouldAttachUserByDomain } = parseResult.data;

	try {
		await createOrganization({ name, domain, shouldAttachUserByDomain });
		revalidateTag('organizations');
	} catch (error) {
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return { success: false, message, errors: null };
		}

		return { success: false, message: 'Unexpected error. Please, try again in a few minutes.', errors: null };
	}

	return { success: true, message: 'Saved organization with success.', errors: null };
}

export async function updateOrganizationAction(data: FormData) {
	const currentOrg = await getCurrentOrg();

	const parseResult = saveOrganizationSchema.safeParse(Object.fromEntries(data));

	if (!parseResult.success) {
		const errors = parseResult.error.flatten().fieldErrors;

		return { success: false, message: null, errors };
	}

	const { name, domain, shouldAttachUserByDomain } = parseResult.data;

	try {
		await updateOrganization({ orgSlug: currentOrg!, name, domain, shouldAttachUserByDomain });

		revalidateTag('organizations');
	} catch (error) {
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();

			return { success: false, message, errors: null };
		}

		return { success: false, message: 'Unexpected error. Please, try again in a few minutes.', errors: null };
	}

	return { success: true, message: 'Saved organization with success.', errors: null };
}
