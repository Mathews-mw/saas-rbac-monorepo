import { Role } from '@saas/auth/src/roles';
import { defineAbilityFor } from '@saas/auth';
import { userSchema } from '@saas/auth/src/models/user';

export function getUserPermissions(userId: string, role: Role) {
	const authUser = userSchema.parse({
		id: userId,
		role,
	});

	const ability = defineAbilityFor(authUser);

	return ability;
}
