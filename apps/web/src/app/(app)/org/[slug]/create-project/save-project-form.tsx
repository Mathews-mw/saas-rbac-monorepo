'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from '@/hooks/use-form-state';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { saveProjectAction } from './actions';

import { Textarea } from '@/components/ui/textarea';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useParams } from 'next/navigation';
import { queryClient } from '@/lib/react-query';

export function SaveProjectForm() {
	const { slug: orgSlug } = useParams<{ slug: string }>();

	const [formState, handleSubmit, isPending] = useFormState(saveProjectAction, () => {
		queryClient.invalidateQueries({ queryKey: ['projects', orgSlug] });
	});

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{formState.success === false && formState.message && (
				<Alert variant="destructive">
					<AlertTriangle className="size-4" />
					<AlertTitle>Save project failed!</AlertTitle>
					<AlertDescription>{formState.message}</AlertDescription>
				</Alert>
			)}

			{formState.success === true && formState.message && (
				<Alert variant="success">
					<AlertTriangle className="size-4" />
					<AlertTitle>Success!</AlertTitle>
					<AlertDescription>{formState.message}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-1">
				<Label htmlFor="name">Project name</Label>
				<Input name="name" id="name" />
				{formState?.errors?.name && (
					<small className="font-medium text-red-500 dark:text-red-400">{formState.errors.name[0]}</small>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="domain">Description</Label>
				<Textarea name="description" id="description" />
				{formState?.errors?.description && (
					<small className="font-medium text-red-500 dark:text-red-400">{formState.errors.description[0]}</small>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={isPending}>
				{isPending && <Loader2 className="animate-spin" />}
				Save project
			</Button>
		</form>
	);
}
