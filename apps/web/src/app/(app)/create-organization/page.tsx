import { Header } from '@/components/header';
import { SaveOrganizationForm } from './save-organization-form';

export default function CreateOrganizationPage() {
	return (
		<div className="space-y-4">
			<Header />

			<div className="mx-auto w-full max-w-[1200px] space-y-4">
				<h1 className="text-2xl font-bold">Create organization</h1>

				<SaveOrganizationForm />
			</div>
		</div>
	);
}
