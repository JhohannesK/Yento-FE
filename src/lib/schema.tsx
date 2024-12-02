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

const variantSchema = z.object({
	size: z.string(),
	color: z.string().min(1, 'Color is required'),
	sku: z.string().min(1, 'SKU is required'),
	weight: z.string(),
	priceModifier: z.number().min(0, 'Price modifier must be a positive number'),
});

export const addNewProductFormSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	stockQuantity: z.number().int().positive({
		message: 'Stock quantity must be a positive integer.',
	}),
	minimumStockLevel: z.number().int().nonnegative({
		message: 'Minimum stock level must be a non-negative integer.',
	}),
	price: z.number().positive({
		message: 'Price must be a positive number.',
	}),
	category: z.string().min(1, {
		message: 'Category is required.',
	}),
	description: z.string().min(10, {
		message: 'Description must be at least 10 characters.',
	}),
	tags: z.array(z.string()).optional(),
	variants: z.array(variantSchema).optional(),
});
