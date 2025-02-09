import { shutdownOrganization } from '@/_http/requests/shutdown-organization';
import { getCurrentOrg } from '@/auth/auth';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export function ShutdownOrgButton() {
	async function shutOrganizationAction() {
		'use server';

		const currentOrg = await getCurrentOrg();

		await shutdownOrganization({ orgSlug: currentOrg! });

		redirect('/');
	}

	return (
		<form action={shutOrganizationAction}>
			<Button type="submit" variant="destructive" className="w-56">
				<XCircle className="mr-2 size-4" />
				Shutdown organization
			</Button>
		</form>
	);
}
