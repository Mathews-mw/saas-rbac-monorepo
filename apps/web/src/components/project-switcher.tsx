'use client';

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

import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/_http/requests/get-projects';

export function ProjectSwitcher() {
	const { slug: orgSlug } = useParams<{ slug: string }>();

	const { data: projects } = useQuery({
		queryKey: ['projects', orgSlug],
		queryFn: async () => getProjects({ org: orgSlug }),
		enabled: !!orgSlug,
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
				{/* {currentOrganization ? (
					<>
						<Avatar className="mr-2 size-5">
							{currentOrganization.avatarUrl && <AvatarImage src={currentOrganization.avatarUrl} />}
							<AvatarFallback />
						</Avatar>

						<span className="truncate text-left">{currentOrganization.name}</span>
					</>
				) : (
					<span className="text-muted-foreground">Select project</span>
				)} */}
				<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" alignOffset={-16} sideOffset={12} className="w-[200px]">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Organizations</DropdownMenuLabel>
					{/* {organizations.map((org) => {
						return (
							<DropdownMenuItem key={org.id} asChild>
								<Link href={`/org/${org.slug}`}>
									<Avatar className="mr-2 size-5">
										{org.avatarUrl && <AvatarImage src={org.avatarUrl} />}
										<AvatarFallback />
									</Avatar>

									<span className="line-clamp-1">{org.name}</span>
								</Link>
							</DropdownMenuItem>
						);
					})} */}
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link href="/">
						<PlusCircle className="mr-2 size-5" />
						Create new
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
