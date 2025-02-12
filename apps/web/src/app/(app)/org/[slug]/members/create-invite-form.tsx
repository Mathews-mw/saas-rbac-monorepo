'use client';

import { useFormState } from '@/hooks/use-form-state';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { AlertTriangle, Loader2, UserPlus2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createInviteAction } from './actions';

export function CreateInviteForm() {
	const [formState, handleSubmit, isPending] = useFormState(createInviteAction);

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{formState.success === false && formState.message && (
				<Alert variant="destructive">
					<AlertTriangle className="size-4" />
					<AlertTitle>Invite failed!</AlertTitle>
					<AlertDescription>{formState.message}</AlertDescription>
				</Alert>
			)}

			<div className="flex items-center gap-2">
				<div className="flex-1 space-y-1">
					<Input name="email" id="email" placeholder="john@example.com" />
					{formState?.errors?.email && (
						<small className="font-medium text-red-500 dark:text-red-400">{formState.errors.email[0]}</small>
					)}
				</div>

				<div>
					<Select name="role" defaultValue="MEMBER">
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="ADMIN">ADMIN</SelectItem>
							<SelectItem value="MEMBER">MEMBER</SelectItem>
							<SelectItem value="BILLING">BILLING</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Button type="submit" disabled={isPending}>
					{isPending && <Loader2 className="animate-spin" />}
					<UserPlus2 className="size-5" />
					Invite user
				</Button>
			</div>
		</form>
	);
}
