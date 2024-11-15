import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const QueryProvider = ({ children }: { children: ReactNode }) => {
	const client = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5,
			},
		},
	});
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default QueryProvider;
