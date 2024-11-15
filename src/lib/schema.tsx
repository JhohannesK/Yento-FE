import { z } from 'zod';

export const signInSchema = z.object({
	email: z.string().email().includes('@'),
	password: z.string().min(1),
});

export const signUpSchema = z
	.object({
		firstName: z.string().min(3),
		lastName: z.string(),
		email: z.string().email().includes('@'),
		username: z.string().min(3, 'Username is required'),
		password: z.string().min(1),
		confirmPassword: z.string(),
		role: z.string(),
	})
	.refine((value) => value.password === value.confirmPassword, {
		message: 'Password does not match',
		path: ['confirmPassword'],
	});

export const addNewProductFormSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Title must be at least 3 characters long' }),
	description: z.string().min(10, {
		message: 'Description must be at least 10 characters long',
	}),
	quantity: z.string({
		message: 'Please provide the quantity',
	}),
	price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
		message: 'Price must be a valid number with up to 2 decimal places',
	}),
	category: z.enum(['electronics', 'clothing', 'books', 'home', 'toys'], {
		required_error: 'Please select a category',
	}),
	tag: z.string(),
	// image: z
	// 	.instanceof(FileList)
	// 	.refine((files) => files.length > 0, 'Image is required'),
});
