'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { getProjects } from '@/_http/requests/get-projects';

import { Skeleton } from './ui/skeleton';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react';

export function ProjectSwitcher() {
	const { slug: orgSlug, project: ProjectSlug } = useParams<{ slug: string; project: string }>();

	const { data, isLoading } = useQuery({
		queryKey: ['projects', orgSlug],
		queryFn: async () => getProjects({ org: orgSlug }),
		enabled: !!orgSlug,
	});

	const currentProject = data && ProjectSlug ? data.projects.find((project) => project.slug === ProjectSlug) : null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				disabled={isLoading}
				className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary"
			>
				{isLoading ? (
					<>
						<Skeleton className="size-4 shrink-0 rounded-full" />
						<Skeleton className="h-4 w-full" />
					</>
				) : (
					<>
						{currentProject ? (
							<>
								<Avatar className="size-5">
									{currentProject.avatarUrl && <AvatarImage src={currentProject.avatarUrl} />}
									<AvatarFallback />
								</Avatar>

								<span className="truncate text-left">{currentProject.name}</span>
							</>
						) : (
							<span className="text-muted-foreground">Select project</span>
						)}
					</>
				)}

				{isLoading ? (
					<Loader2 className="ml-auto size-4 shrink-0 animate-spin text-muted-foreground" />
				) : (
					<ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
				)}
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" alignOffset={-16} sideOffset={12} className="w-[200px]">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Projects</DropdownMenuLabel>
					{data?.projects &&
						data.projects.map((project) => {
							return (
								<DropdownMenuItem key={project.id} asChild>
									<Link href={`/org/${orgSlug}/project/${project.slug}`}>
										<Avatar className="mr-2 size-5">
											{project.avatarUrl && <AvatarImage src={project.avatarUrl} />}
											<AvatarFallback />
										</Avatar>

										<span className="line-clamp-1">{project.name}</span>
									</Link>
								</DropdownMenuItem>
							);
						})}
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link href={`/org/${orgSlug}/create-project`}>
						<PlusCircle className="mr-2 size-5" />
						Create new
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
