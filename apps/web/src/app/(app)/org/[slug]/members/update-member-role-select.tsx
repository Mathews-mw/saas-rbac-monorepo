'use client';

import { ComponentProps } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateMemberAction } from './actions';
import { Role } from '@saas/auth';

interface IProps extends ComponentProps<typeof Select> {
	memberId: string;
}

export function UpdateMemberRoleSelect({ memberId, ...props }: IProps) {
	async function handleUpdateMemberRole(role: Role) {
		await updateMemberAction(memberId, role);
	}

	return (
		<Select onValueChange={handleUpdateMemberRole} {...props}>
			<SelectTrigger className="h-8 w-32">
				<SelectValue />
			</SelectTrigger>

			<SelectContent>
				<SelectItem value="ADMIN">ADMIN</SelectItem>
				<SelectItem value="MEMBER">MEMBER</SelectItem>
				<SelectItem value="BILLING">BILLING</SelectItem>
			</SelectContent>
		</Select>
	);
}
