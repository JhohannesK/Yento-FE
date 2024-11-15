'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icons } from '../ui/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/lib/schema';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/hooks/useAuth';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthSignInForm({ className, ...props }: UserAuthFormProps) {
	const { signIn } = useAuth();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	function onSubmit(values: z.infer<typeof signInSchema>) {
		signIn.mutate(values);
	}
	return (
		<div className={cn('grid gap-6', className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='grid gap-2'>
						<div className='grid gap-1'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												{...field}
												id='email'
												placeholder='name@example.com'
												type='email'
												autoCapitalize='none'
												autoComplete='email'
												autoCorrect='off'
												disabled={signIn.isPending}
											/>
										</FormControl>
										<FormDescription>
											This is your public display name.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												id='password'
												type='password'
												placeholder='password'
												{...field}
											/>
										</FormControl>
										<FormDescription>Your password</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button type={'submit'} disabled={signIn.isPending}>
							{signIn.isPending && (
								<Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
							)}
							Sign In with Email
						</Button>
					</div>
				</form>
			</Form>
			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='px-2 bg-background text-muted-foreground'>
						Or continue with
					</span>
				</div>
			</div>
			<Button variant='outline' type='button' disabled={signIn.isPending}>
				{signIn.isPending ? (
					<Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
				) : (
					<Icons.google className='w-4 h-4 mr-2' />
				)}{' '}
				Google
			</Button>
		</div>
	);
}
