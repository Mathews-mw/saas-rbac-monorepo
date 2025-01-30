import { isAuthenticated } from '@/auth/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const isAuth = await isAuthenticated();

	if (!isAuth) {
		redirect('/auth/sign-in');
	}

	return <>{children}</>;
}
