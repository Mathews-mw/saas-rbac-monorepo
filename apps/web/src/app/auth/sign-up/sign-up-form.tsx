'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { signUpAction } from './actions';
import { useFormState } from '@/hooks/use-form-state';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { signInWithGithub } from '../actions';

export function SignUpForm() {
	const router = useRouter();

	const [formState, handleSubmit, isPending] = useFormState(signUpAction, () => {
		router.replace('/auth/sign-in');
	});

	return (
		<div className="space-y-4">
			<form onSubmit={handleSubmit} className="space-y-4">
				{formState.success === false && formState.message && (
					<Alert variant="destructive">
						<AlertTriangle className="size-4" />
						<AlertTitle>Sign up failed!</AlertTitle>
						<AlertDescription>{formState.message}</AlertDescription>
					</Alert>
				)}

				<div className="space-y-1">
					<Label htmlFor="name">Name</Label>
					<Input name="name" id="name" />
					{formState?.errors?.name && (
						<small className="font-medium text-red-500 dark:text-red-400">{formState.errors.name[0]}</small>
					)}
				</div>

				<div className="space-y-1">
					<Label htmlFor="email">E-mail</Label>
					<Input name="email" id="email" type="email" />
					{formState?.errors?.email && (
						<small className="font-medium text-red-500 dark:text-red-400">{formState.errors.email[0]}</small>
					)}
				</div>

				<div className="space-y-1">
					<Label htmlFor="password">Password</Label>
					<Input name="password" id="password" type="password" />
					{formState?.errors?.password && (
						<small className="font-medium text-red-500 dark:text-red-400">{formState.errors.password[0]}</small>
					)}
				</div>

				<div className="space-y-1">
					<Label htmlFor="confirmPassword">Confirm password</Label>
					<Input name="confirmPassword" id="confirmPassword" type="password" />
					{formState?.errors?.confirmPassword && (
						<small className="font-medium text-red-500 dark:text-red-400">{formState.errors.confirmPassword[0]}</small>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending && <Loader2 className="animate-spin" />}
					Create Account
				</Button>

				<Button asChild type="button" variant="link" size="sm" className="w-full">
					<Link href="/auth/sign-in">Already registered? Sign in</Link>
				</Button>
			</form>

			<Separator />

			<form action={signInWithGithub}>
				<Button type="submit" variant="outline" disabled={isPending} className="w-full">
					<Image src="/github-icon.svg" alt="Github icon" className="mr-2 size-7 dark:invert" width={32} height={32} />
					Sign in with Github
				</Button>
			</form>
		</div>
	);
}
