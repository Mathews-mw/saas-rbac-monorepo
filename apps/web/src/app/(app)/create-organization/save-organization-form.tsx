'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from '@/hooks/use-form-state';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { OrganizationSchema, saveOrganizationAction, updateOrganizationAction } from './actions';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface IProps {
	isUpdating?: boolean;
	initialData?: OrganizationSchema;
}

export function SaveOrganizationForm({ isUpdating = false, initialData }: IProps) {
	const formAction = isUpdating ? updateOrganizationAction : saveOrganizationAction;

	const [formState, handleSubmit, isPending] = useFormState(formAction);

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{formState.success === false && formState.message && (
				<Alert variant="destructive">
					<AlertTriangle className="size-4" />
					<AlertTitle>Sign in failed!</AlertTitle>
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
				<Label htmlFor="name">Organization name</Label>
				<Input name="name" id="name" defaultValue={initialData?.name} />
				{formState?.errors?.name && (
					<small className="font-medium text-red-500 dark:text-red-400">{formState.errors.name[0]}</small>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="domain">E-mail domain</Label>
				<Input
					name="domain"
					id="domain"
					inputMode="url"
					placeholder="example.com"
					defaultValue={initialData?.domain ?? undefined}
				/>
				{formState?.errors?.domain && (
					<small className="font-medium text-red-500 dark:text-red-400">{formState.errors.domain[0]}</small>
				)}
			</div>

			<div className="space-y-1">
				<div className="flex items-baseline space-x-2">
					<div className="translate-y-0.5">
						<Checkbox
							name="shouldAttachUserByDomain"
							id="shouldAttachUserByDomain"
							defaultChecked={initialData?.shouldAttachUserByDomain}
						/>
					</div>
					<label htmlFor="shouldAttachUserByDomain" className="space-y-1">
						<span className="text-sm font-medium leading-none">Auto-join members</span>
						<p className="text-sm text-muted-foreground">
							This will automatically invite all members with same e-mail domain to this organization.
						</p>
					</label>
				</div>
			</div>

			{formState?.errors?.shouldAttachUserByDomain && (
				<small className="font-medium text-red-500 dark:text-red-400">
					{formState.errors.shouldAttachUserByDomain[0]}
				</small>
			)}

			<Button type="submit" className="w-full" disabled={isPending}>
				{isPending && <Loader2 className="animate-spin" />}
				Save organization
			</Button>
		</form>
	);
}
