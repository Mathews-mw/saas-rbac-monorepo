import { api } from '@/_http/api-client';

interface IRequest {
	name: string;
	email: string;
	password: string;
}

export async function signUp({ name, email, password }: IRequest): Promise<void> {
	await api.post('users', {
		json: {
			name,
			email,
			password,
		},
	});
}
