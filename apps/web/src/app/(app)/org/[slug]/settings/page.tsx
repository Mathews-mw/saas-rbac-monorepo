import { SaveOrganizationForm } from '@/app/(app)/create-organization/save-organization-form';
import { ability, getCurrentOrg } from '@/auth/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShutdownOrgButton } from './shutdown-org-buttom';
import { getOrganization } from '@/_http/requests/get-organization';
import { Billing } from './billing';

export default async function SettingsPage() {
	const currentOrg = await getCurrentOrg();
	const permissions = await ability();

	const canUpdateOrganization = permissions?.can('update', 'Organization');
	const canGetBilling = permissions?.can('get', 'Billing');
	const canShutdownOrganization = permissions?.can('delete', 'Organization');

	const { organization } = await getOrganization(currentOrg!);

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Settings</h1>

			<div className="space-y-4">
				{canUpdateOrganization && (
					<Card>
						<CardHeader>
							<CardTitle>Organization Settings</CardTitle>
							<CardDescription>Update your organization details</CardDescription>
						</CardHeader>

						<CardContent>
							<SaveOrganizationForm
								isUpdating
								initialData={{
									name: organization.name,
									domain: organization.domain,
									shouldAttachUserByDomain: organization.shouldAttachUsersByDomain,
								}}
							/>
						</CardContent>
					</Card>
				)}

				{canGetBilling && <Billing />}

				{canShutdownOrganization && (
					<Card>
						<CardHeader>
							<CardTitle>Shutdown Organization</CardTitle>
							<CardDescription>
								This will delete all organizations. Caution, you can not undo this action!
							</CardDescription>
						</CardHeader>

						<CardContent>
							<ShutdownOrgButton />
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
