import Image from 'next/image';
import { ArrowLeftRight, Crown, UserMinus } from 'lucide-react';
import { ability, getCurrentOrg } from '@/auth/auth';
import { getMembers } from '@/_http/requests/get-members';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getMembership } from '@/_http/requests/get-membership';
import { getOrganization } from '@/_http/requests/get-organization';
import { organizationSchema } from '@saas/auth/src/models/organization';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { removeMemberAction } from './actions';
import { UpdateMemberRoleSelect } from './update-member-role-select';

export async function MemberList() {
	const permissions = await ability();

	const currentOrg = await getCurrentOrg();
	const { membership } = await getMembership(currentOrg!);
	const { members } = await getMembers(currentOrg!);
	const { organization } = await getOrganization(currentOrg!);

	const authOrganization = organizationSchema.parse(organization);

	return (
		<div className="space-y-2">
			<h2 className="text-lg font-semibold">Members</h2>

			<div className="rounded border">
				<Table>
					<TableBody>
						{members.map((member) => {
							return (
								<TableRow key={member.id}>
									<TableCell className="py-2.5">
										<Avatar>
											<AvatarFallback />
											{member.avatarUrl && (
												<Image
													src={member.avatarUrl}
													alt=""
													width={32}
													height={32}
													className="aspect-square size-full"
												/>
											)}
										</Avatar>
									</TableCell>
									<TableCell className="py-2.5">
										<div className="flex flex-col">
											<span className="inline-flex items-center gap-2 font-medium">
												{member.name} {member.userId === membership.userId && ' (me)'}{' '}
												{organization.ownerId === member.userId && (
													<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
														<Crown className="size-3" />
														Owner
													</span>
												)}
											</span>
											<span className="text-xs text-muted-foreground">{member.email}</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-end gap-2">
											{permissions?.can('transfer_ownership', authOrganization) && (
												<Button size="sm" variant="outline">
													<ArrowLeftRight className="mr-2 size-4" />
													Transfer ownership
												</Button>
											)}

											<UpdateMemberRoleSelect
												memberId={member.id}
												value={member.role}
												disabled={
													member.userId === membership.userId ||
													member.userId === organization.ownerId ||
													permissions?.cannot('update', 'User')
												}
											/>

											{permissions?.can('delete', 'User') && (
												<form action={removeMemberAction.bind(null, member.id)}>
													<Button
														size="sm"
														variant="destructive"
														disabled={member.userId === membership.userId || member.userId === organization.ownerId}
													>
														<UserMinus className="mr-2 size-4" />
														Remover
													</Button>
												</form>
											)}
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
