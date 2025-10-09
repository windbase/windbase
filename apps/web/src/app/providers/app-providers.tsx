import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, Toaster } from '@windbase/ui';
import { BrowserRouter } from 'react-router-dom';
import { DialogInput } from '@/shared/components';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 30,
			retry: 1,
			refetchOnWindowFocus: false
		}
	}
});

interface AppProvidersProps {
	children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<Toaster />
			<DialogInput />
			<BrowserRouter>
				<ThemeProvider>{children}</ThemeProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

