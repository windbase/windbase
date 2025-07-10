import './lib/analytics';
import { ThemeProvider } from '@windbase/ui';
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

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<StrictMode>
		<DialogInputOverlay />
		<BrowserRouter>
			<ThemeProvider>
				<Router />
			</ThemeProvider>
		</BrowserRouter>
	</StrictMode>
);
