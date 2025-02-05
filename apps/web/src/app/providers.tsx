'use client';

import { ThemeProvider } from 'next-themes';
import { queryClient } from '@/lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
}
