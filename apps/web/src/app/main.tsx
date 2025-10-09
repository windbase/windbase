import '@/shared/utils/analytics';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { AppProviders } from './providers/app-providers';
import Router from './router';

import '../styles.css';

import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/700.css';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<StrictMode>
		<AppProviders>
			<Router />
		</AppProviders>
	</StrictMode>
);
