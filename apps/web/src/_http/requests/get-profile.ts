import { api } from '@/_http/api-client';

interface IResponse {
	user: {
		id: string;
		name: string | null;
		email: string;
		avatarUrl: string | null;
	};
}

export async function getProfile(): Promise<IResponse> {
	const response = await api.get('profile').json<IResponse>();

	return response;
}
