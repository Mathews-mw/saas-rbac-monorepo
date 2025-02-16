import { ability, getCurrentOrg } from '@/auth/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProjectList } from './project-list';
import { CirclePlus } from 'lucide-react';

export default async function ProjectsPages() {
	const currentOrg = await getCurrentOrg();
	const permissions = await ability();

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Projects</h1>

				{permissions?.can('create', 'Project') && (
					<Button size="sm" asChild>
						<Link href={`/org/${currentOrg}/create-project`}>
							New <CirclePlus />
						</Link>
					</Button>
				)}
			</div>

			{permissions?.can('get', 'Project') ? (
				<ProjectList />
			) : (
				<p className="text-sm text-muted-foreground">You are not allowed to see organization projects.</p>
			)}
		</div>
	);
}
