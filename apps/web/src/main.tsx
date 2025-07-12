import './lib/analytics';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, Toaster } from '@windbase/ui';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import DialogInputOverlay from './components/shared/dialog-input';
import Router from './router';

import './styles.css';

import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/700.css';

// Create a QueryClient instance
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Templates/blocks don't change often, so we can cache for longer
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
			// Retry failed requests
			retry: 1,
			// Refetch on window focus for fresh data
			refetchOnWindowFocus: false
		}
	}
});

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Toaster />
			<DialogInputOverlay />
			<BrowserRouter>
				<ThemeProvider>
					<Router />
				</ThemeProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
);
