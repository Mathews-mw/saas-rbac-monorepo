import ky from 'ky';
import { env } from '@saas/env';
import { type CookiesFn, getCookie } from 'cookies-next';

export const api = ky.create({
	prefixUrl: env.NEXT_PUBLIC_API_URL,
	hooks: {
		beforeRequest: [
			async (request) => {
				let cookieStore: CookiesFn | undefined;

				//  window === 'undefined' => indica que o trecho de código está rodando no server side
				if (typeof window === 'undefined') {
					const { cookies: serverCookies } = await import('next/headers');

					cookieStore = serverCookies;
				}

				const token = await getCookie('token', { cookies: cookieStore });

				console.log('token: ', token);

				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`);
				}
			},
		],
	},
});
