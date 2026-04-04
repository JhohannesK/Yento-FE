import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './lib/routes.tsx';
import QueryProvider from './lib/QueryProvider.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import { bootstrapAuth } from './lib/auth/session';

void bootstrapAuth().finally(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<QueryProvider>
				<RouterProvider router={router} />
				<Toaster position='top-center' richColors />
			</QueryProvider>
		</StrictMode>,
	);
});
