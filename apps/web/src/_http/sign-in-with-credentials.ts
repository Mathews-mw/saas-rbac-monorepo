import { api } from '@/_http/api-client';

interface IRequest {
	email: string;
	password: string;
}

interface IResponse {
	token: string;
}

export async function signInWithCredentials({ email, password }: IRequest): Promise<IResponse> {
	const response = await api
		.post('sessions/password', {
			json: {
				email,
				password,
			},
		})
		.json<IResponse>();

	return response;
}
