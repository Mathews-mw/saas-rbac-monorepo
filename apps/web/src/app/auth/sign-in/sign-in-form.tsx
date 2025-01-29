'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { useFormState } from '@/hooks/use-form-state';
import { signInWithCredentialsAction } from './actions';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { signInWithGithub } from '../actions';

export function SignInForm() {
	const router = useRouter();

	const [formState, handleSubmit, isPending] = useFormState(signInWithCredentialsAction, () => {
		router.replace('/');
	});

	return (
		<div className="space-y-4">
			<form onSubmit={handleSubmit} className="space-y-4">
				{formState.success === false && formState.message && (
					<Alert variant="destructive">
						<AlertTriangle className="size-4" />
						<AlertTitle>Sign in failed!</AlertTitle>
						<AlertDescription>{formState.message}</AlertDescription>
					</Alert>
				)}

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

				<Link href="/auth/forgot-password" className="text-xs font-medium text-foreground hover:underline">
					Forgot your password?
				</Link>

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending && <Loader2 className="animate-spin" />}
					Sign in with e-mail
				</Button>

				<Button asChild type="button" variant="link" size="sm" disabled={isPending} className="w-full">
					<Link href="/auth/sign-up">Create new account</Link>
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
