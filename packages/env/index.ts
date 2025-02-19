import { z } from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
	server: {
		API_SERVER_PORT: z.coerce.number().default(3333),
		DATABASE_URL: z.string().url(),
		JWT_SECRET: z.string(),
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),
		GITHUB_CLIENT_REDIRECT_URI: z.string().url(),
	},
	client: {},
	shared: {
		NEXT_PUBLIC_API_URL: z.string().url(),
	},
	runtimeEnv: {
		API_SERVER_PORT: process.env.API_SERVER_PORT,
		DATABASE_URL: process.env.DATABASE_URL,
		JWT_SECRET: process.env.JWT_SECRET,
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		GITHUB_CLIENT_REDIRECT_URI: process.env.GITHUB_CLIENT_REDIRECT_URI,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	},
	emptyStringAsUndefined: true,
});
