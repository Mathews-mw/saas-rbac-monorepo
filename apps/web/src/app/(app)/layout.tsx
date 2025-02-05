import { isAuthenticated } from '@/auth/auth';
import { redirect } from 'next/navigation';

export default async function AppLayout({
	children,
	sheet,
}: Readonly<{
	children: React.ReactNode;
	sheet: React.ReactNode;
}>) {
	const isAuth = await isAuthenticated();

	if (!isAuth) {
		redirect('/auth/sign-in');
	}

	return (
		<>
			{children}
			{sheet}
		</>
	);
}
