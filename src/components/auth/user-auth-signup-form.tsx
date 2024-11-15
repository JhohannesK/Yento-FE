'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icons } from '../ui/icons';
import { signUpSchema } from '@/lib/schema';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/hooks/useAuth';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthSignUpForm({ className, ...props }: UserAuthFormProps) {
	const { signUp } = useAuth();
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		mode: 'onChange',
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			role: 'User',
		},
	});

	function onSubmit(values: z.infer<typeof signUpSchema>) {
		signUp.mutate(values);
	}

	return (
		<div className={cn('grid gap-6', className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='grid gap-2'>
						<div className='grid gap-1'>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>FirstName</FormLabel>
										<FormControl>
											<Input
												id='firstname'
												type='text'
												placeholder='first name'
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>Your firstname</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>LastName</FormLabel>
										<FormControl>
											<Input
												id='lastname'
												type='text'
												placeholder='last name'
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>Your firstname</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												id='username'
												type='text'
												placeholder='username'
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>Your firstname</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
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
												disabled={signUp.isPending}
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
							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												id='confirmPassword'
												type='password'
												placeholder='confirm password'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Retype your password to confirm
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button disabled={signUp.isPending}>
							{signUp.isPending && (
								<Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
							)}
							Sign Up with Email
						</Button>
					</div>
				</form>
			</Form>
			{/* <div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='px-2 bg-background text-muted-foreground'>
						Or continue with
					</span>
				</div>
			</div>
			<Button variant='outline' type='button' disabled={signUp.isPending}>
				{signUp.isPending ? (
					<Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
				) : (
					<Icons.gitHub className='w-4 h-4 mr-2' />
				)}{' '}
				GitHub
			</Button> */}
		</div>
	);
}
