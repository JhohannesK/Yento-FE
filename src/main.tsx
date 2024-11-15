import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './lib/routes.tsx';
import QueryProvider from './lib/QueryProvider.tsx';
import { Toaster } from './components/ui/sonner.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryProvider>
			<RouterProvider router={router} />
			<Toaster position='top-center' richColors />
		</QueryProvider>
	</StrictMode>
);
