import { api } from '@/_http/api-client';

interface IResponse {
	billing: {
		seats: {
			amount: number;
			unit: number;
			price: number;
		};
		projects: {
			amount: number;
			unit: number;
			price: number;
		};
		total: number;
	};
}

export async function getBilling(orgSlug: string): Promise<IResponse> {
	const response = await api.get(`organizations/${orgSlug}/billing`).json<IResponse>();

	return response;
}
