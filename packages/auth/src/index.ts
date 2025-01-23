import { z } from 'zod';
import { AbilityBuilder, CreateAbility, createMongoAbility, MongoAbility } from '@casl/ability';

import { User } from './models/user';
import { permissions } from './permissions';
import { userSubject } from './subjects/user';
import { inviteSubject } from './subjects/invite';
import { projectSubject } from './subjects/project';
import { billingSubject } from './subjects/billing';
import { organizationSubject } from './subjects/organization';

// type AppAbilities = UserSubject | ProjectSubject | ['manage', 'all'];

const appAbilitiesSchema = z.union([
	userSubject,
	projectSubject,
	organizationSubject,
	inviteSubject,
	billingSubject,
	z.tuple([z.literal('manage'), z.literal('all')]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
	const builder = new AbilityBuilder(createAppAbility);

	if (typeof permissions[user.role] !== 'function') {
		throw new Error(`Permission for role ${user.role} not found`);
	}

	permissions[user.role](user, builder);

	const ability = builder.build({
		detectSubjectType(subject) {
			return subject.__typename;
		},
	});

	ability.can = ability.can.bind(ability);
	ability.cannot = ability.cannot.bind(ability);

	return ability;
}
