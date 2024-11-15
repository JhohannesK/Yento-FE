import { UserAuthSignInForm } from '@/components/auth/user-auth-signin-form';
import { UserAuthSignUpForm } from '@/components/auth/user-auth-signup-form';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function AuthenticationPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const params = searchParams.get('auth');
	let value = params || 'signin';

	useEffect(() => {
		setSearchParams({ auth: value });
	}, [setSearchParams, value]);

	const handleSignUpClick = () => {
		value = 'signup';
		setSearchParams({ auth: value });
	};

	const handleSignInClick = () => {
		value = 'signin';
		setSearchParams({ auth: value });
	};
	return (
		<div className='w-full'>
			<div className='md:hidden'>
				<img
					src='/authentication-light.png'
					width={1280}
					height={843}
					alt='Authentication'
					className='block dark:hidden'
				/>
				<img
					src='/authentication-dark.png'
					width={1280}
					height={843}
					alt='Authentication'
					className='hidden dark:block'
				/>
			</div>
			<div className='relative flex-col items-center justify-center hidden h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
				{params === 'signin' ? (
					<Button
						onClick={handleSignUpClick}
						className={cn(
							buttonVariants({ variant: 'ghost' }),
							'absolute right-4 top-4 md:right-8 md:top-8'
						)}
					>
						Sign Up
					</Button>
				) : (
					<Button
						onClick={handleSignInClick}
						className={cn(
							buttonVariants({ variant: 'ghost' }),
							'absolute right-4 top-4 md:right-8 md:top-8'
						)}
					>
						Login
					</Button>
				)}
				<div className='relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex'>
					<div className='absolute inset-0 bg-zinc-900' />
					<div className='relative z-20 flex items-center text-lg font-medium'>
						<Package className='w-6 h-6' />
						Yeton
					</div>
					<div className='relative z-20 mt-auto'>
						<blockquote className='space-y-2'>
							<p className='text-lg'>
								&ldquo;This platform has helped me buy quality products
								for myself and loved ones. Delivers and time and items
								come as ordered.&rdquo;
							</p>
							<footer className='text-sm'>Owusu Agyemang</footer>
						</blockquote>
					</div>
				</div>
				<div className='lg:p-8'>
					<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
						<div className='flex flex-col space-y-2 text-center'>
							{params === 'signin' ? (
								<>
									<h1 className='text-2xl font-semibold tracking-tight'>
										Login
									</h1>
									<p className='text-sm text-muted-foreground'>
										Enter your email below to login into your account
									</p>
								</>
							) : (
								<>
									<h1 className='text-2xl font-semibold tracking-tight'>
										Create an account
									</h1>
									<p className='text-sm text-muted-foreground'>
										Enter your email below to create your account
									</p>
								</>
							)}
						</div>
						{params === 'signin' ? (
							<UserAuthSignInForm />
						) : (
							<UserAuthSignUpForm />
						)}
						<p className='px-8 text-sm text-center text-muted-foreground'>
							By clicking continue, you agree to our{' '}
							<Link
								to='/terms'
								className='underline underline-offset-4 hover:text-primary'
							>
								Terms of Service
							</Link>{' '}
							and{' '}
							<a
								href='/privacy'
								className='underline underline-offset-4 hover:text-primary'
							>
								Privacy Policy
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
