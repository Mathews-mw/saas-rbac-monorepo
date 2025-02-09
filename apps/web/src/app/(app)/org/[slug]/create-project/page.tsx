import { ability } from '@/auth/auth';
import { redirect } from 'next/navigation';

import { SaveProjectForm } from './save-project-form';

export default async function CreateProjectPage() {
	const permissions = await ability();

	if (permissions?.cannot('create', 'Project')) {
		redirect('/');
	}

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Create Project</h1>

			<SaveProjectForm />
		</div>
	);
}
