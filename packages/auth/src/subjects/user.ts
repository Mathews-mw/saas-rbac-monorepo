import { z } from 'zod';

// export type UserSubject = ['create' | 'delete' | 'manage' | 'invite', 'User'];

export const userSubject = z.tuple([
	z.union([z.literal('manage'), z.literal('get'), z.literal('update'), z.literal('delete')]),
	z.literal('User'),
]);

export type UserSubject = z.infer<typeof userSubject>;
