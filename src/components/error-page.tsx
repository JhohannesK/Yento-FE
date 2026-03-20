import { AlertTriangle } from 'lucide-react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);
	const navigate = useNavigate();

	const message =
		(error as { statusText?: string; message?: string })?.statusText ||
		(error as { statusText?: string; message?: string })?.message ||
		'An unexpected error occurred.';

	return (
		<main
			id='error-page'
			className='flex min-h-[70vh] flex-col items-center justify-center w-full px-4 py-12 text-center gap-4'
		>
			<div className='flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-10 max-w-xl'>
				<AlertTriangle className='h-10 w-10 text-primary' />
				<h1 className='text-2xl font-bold'>Something went wrong</h1>
				<p className='text-muted-foreground max-w-[520px]'>
					Sorry, we couldn't load that page. Try going back home and continue shopping.
				</p>
				<p className='text-sm text-muted-foreground'>
					<i>{message}</i>
				</p>
				<div className='pt-2'>
					<Button onClick={() => navigate('/shop/home')}>Go back home</Button>
				</div>
			</div>
		</main>
	);
}
