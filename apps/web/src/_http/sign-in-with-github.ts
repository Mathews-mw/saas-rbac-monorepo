import { api } from '@/_http/api-client';

interface IRequest {
	code: string;
}

interface IResponse {
	token: string;
}

export async function signInWithGithub({ code }: IRequest): Promise<IResponse> {
	const response = await api
		.post('sessions/github', {
			json: {
				code,
			},
		})
		.json<IResponse>();

	return response;
}
