import { UserAuthSignInForm } from '@/components/auth/user-auth-signin-form';
import { UserAuthSignUpForm } from '@/components/auth/user-auth-signup-form';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function AuthenticationPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const params = searchParams.get('auth');
	let value = params || 'signin';

	useEffect(() => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set('auth', value);
			return next;
		});
	}, [setSearchParams, value]);

	const handleSignUpClick = () => {
		value = 'signup';
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set('auth', value);
			return next;
		});
	};

	const handleSignInClick = () => {
		value = 'signin';
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set('auth', value);
			return next;
		});
	};
	return (
		<div className="flex min-h-dvh w-full flex-col bg-background lg:grid lg:h-screen lg:max-w-none lg:grid-cols-2">
			<div className="fixed right-4 top-4 z-50 md:right-8 md:top-8">
				{params === 'signin' ? (
					<Button
						onClick={handleSignUpClick}
						variant="default"
					>
						Sign Up
					</Button>
				) : (
					<Button
						onClick={handleSignInClick}
						variant="default"
					>
						Login
					</Button>
				)}
			</div>

			{/* Desktop: quote panel */}
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
				<div className="absolute inset-0 bg-zinc-900" />
				<div className="relative z-20 flex items-center gap-2 text-lg font-medium">
					<Package className="h-6 w-6" />
					Yeton
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;This platform has helped me buy quality products for myself
							and loved ones. Delivers and time and items come as
							ordered.&rdquo;
						</p>
						<footer className="text-sm">Owusu Agyemang</footer>
					</blockquote>
				</div>
			</div>

			{/* Mobile / tablet: hero strip (hidden on large split layout) */}
			{/* <div className="relative w-full shrink-0 lg:hidden">
				<img
					src="/authentication-light.png"
					width={1280}
					height={843}
					alt=""
					className="block max-h-[38vh] w-full object-cover object-center dark:hidden"
				/>
				<img
					src="/authentication-dark.png"
					width={1280}
					height={843}
					alt=""
					className="hidden max-h-[38vh] w-full object-cover object-center dark:block"
				/>
			</div> */}

			<div className="flex items-center gap-2 text-lg font-medium pt-5 px-5 md:hidden">
				<Package className="h-6 w-6" />
				Yeton
			</div>
			{/* Form — always mounted; fills remaining space on small screens */}
			<div className="flex flex-1 flex-col justify-center px-4 py-8 pb-10 sm:px-6 lg:p-8 lg:pb-8">
				<div className="mx-auto flex w-full max-w-[min(100%,350px)] flex-col justify-center space-y-6">
					<div className="flex flex-col space-y-2 text-center">
						{params === 'signin' ? (
							<>
								<h1 className="text-2xl font-semibold tracking-tight">Login</h1>
								<p className="text-sm text-muted-foreground">
									Enter your email below to login into your account
								</p>
							</>
						) : (
							<>
								<h1 className="text-2xl font-semibold tracking-tight">
									Create an account
								</h1>
								<p className="text-sm text-muted-foreground">
									Enter your email below to create your account
								</p>
							</>
						)}
					</div>
					{params === 'signin' ? (
						<div
							key={params}
							className="animate-[fadeInUp_300ms_var(--ease-spring)_forwards]"
						>
							<UserAuthSignInForm />
						</div>
					) : (
						<div
							key={params}
							className="animate-[fadeInUp_300ms_var(--ease-spring)_forwards]"
						>
							<UserAuthSignUpForm />
						</div>
					)}
					<p className="px-2 text-center text-sm text-muted-foreground sm:px-8">
						By clicking continue, you agree to our{' '}
						<Link
							to="/terms"
							className="underline underline-offset-4 hover:text-primary"
						>
							Terms of Service
						</Link>{' '}
						and{' '}
						<a
							href="/privacy"
							className="underline underline-offset-4 hover:text-primary"
						>
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	);
}
