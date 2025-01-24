import Link from 'next/link';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SignUpPage() {
	return (
		<form action="" className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="name">Name</Label>
				<Input name="name" id="name" />
			</div>

			<div className="space-y-1">
				<Label htmlFor="email">E-mail</Label>
				<Input name="email" id="email" type="email" />
			</div>

			<div className="space-y-1">
				<Label htmlFor="password">Password</Label>
				<Input name="password" id="password" type="password" />
			</div>

			<div className="space-y-1">
				<Label htmlFor="confirmPassword">Confirm password</Label>
				<Input name="confirmPassword" id="confirmPassword" type="password" />
			</div>

			<Button type="submit" className="w-full">
				Create account
			</Button>

			<Button asChild type="button" variant="link" size="sm" className="w-full">
				<Link href="/auth/sign-in">Already registered? Sign in</Link>
			</Button>

			<Separator />

			<Button type="submit" variant="outline" className="w-full">
				<Image src="/github-icon.svg" alt="Github icon" className="mr-2 size-7 dark:invert" width={32} height={32} />
				Sign up with Github
			</Button>
		</form>
	);
}
