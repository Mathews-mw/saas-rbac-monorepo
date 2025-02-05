import './globals.css';

import type { Metadata } from 'next';

import Providers from './providers';

export const metadata: Metadata = {
	title: 'Create Next App',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
