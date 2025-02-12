import { Button } from '@/components/ui/button';
import { XOctagon } from 'lucide-react';
import { revokeInviteAction } from './actions';

interface IProps {
	inviteId: string;
}

export function RevokeInviteButton({ inviteId }: IProps) {
	return (
		<form action={revokeInviteAction.bind(null, inviteId)}>
			<Button size="sm" variant="destructive">
				<XOctagon className="mr-2 size-4" />
				Revoke invite
			</Button>
		</form>
	);
}
