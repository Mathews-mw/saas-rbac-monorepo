import Image from 'next/image';
import { ProfileButton } from './profile-button';
import { Slash } from 'lucide-react';
import { OrganizationSwitcher } from './organization-switcher';
import { ability } from '@/auth/auth';

export async function Header() {
	const permissions = await ability();

	return (
		<div className="mx-auto flex max-w-[1200px] items-center justify-between">
			<div className="flex items-center gap-3">
				<Image src="/logo.svg" alt="logo" width={32} height={32} className="size-8" />

				<Slash className="size-3 -rotate-[24deg] text-border" />

				<OrganizationSwitcher />

				{permissions?.can('get', 'Project') && <p>Projetos</p>}
			</div>

			<div className="flex items-center gap-4">
				<ProfileButton />
			</div>
		</div>
	);
}
