import { ability } from '@saas/auth';

const testAuth = ability.can('invite', 'User');

console.log(testAuth);
