import Image from 'next/image';
import { ProfileButton } from './profile-button';

export function Header() {
	return (
		<div className="mx-auto flex max-w-[1200px] items-center justify-between">
			<div className="flex items-center gap-3">
				<Image src="/logo.svg" alt="logo" width={32} height={32} className="size-8" />
			</div>

			<div className="flex items-center gap-4">
				<ProfileButton />
			</div>
		</div>
	);
}
