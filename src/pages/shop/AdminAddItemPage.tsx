import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertCircle, ChevronLeft, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { addNewProductFormSchema } from '@/lib/schema';
import { AddNewProduct } from '@/lib/types';
import useProduct from '@/lib/hooks/useProduct';

export default function AdminNewItem() {
	const { addNewProduct, isProductAdditionPending, isProductAdditionSuccess } =
		useProduct();

	const form = useForm<AddNewProduct>({
		resolver: zodResolver(addNewProductFormSchema),
		defaultValues: {
			name: '',
			quantity: '',
			description: '',
			price: '',
			category: undefined,
			tag: 'NEW',
		},
	});

	const onSubmit = async (values: AddNewProduct) => {
		const data = {
			...values,
			price: parseFloat(values.price),
			quantity: parseInt(values.quantity),
		};
		console.log('🚀 ~ onSubmit ~ data:', data);
		addNewProduct(data);
	};

	return (
		<div className='container mx-auto px-4 py-8 flex-1 lg:w-[120rem]'>
			<Link
				to='/shop/home'
				className='inline-flex items-center mb-4 text-sm font-medium text-muted-foreground hover:text-primary'
			>
				<ChevronLeft className='w-4 h-4 mr-2' />
				Back to Home
			</Link>
			<Card className='max-w-2xl mx-auto'>
				<CardHeader>
					<CardTitle>Add New Product</CardTitle>
					<CardDescription>
						Fill in the details to add a new product to the store.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-8'
						>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Product Title</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter product title'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											The name of the product as it will appear in
											the store.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Enter product description'
												className='resize-none'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Provide a detailed description of the product.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='price'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input
												type='text'
												placeholder='Enter price'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Enter the price in dollars (e.g., 19.99).
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='quantity'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Quantity</FormLabel>
										<FormControl>
											<Input
												type='text'
												placeholder='Enter the quantity in stock'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This would display as the number of the item in
											stock
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='category'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a category' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='electronics'>
													Electronics
												</SelectItem>
												<SelectItem value='clothing'>
													Clothing
												</SelectItem>
												<SelectItem value='books'>Books</SelectItem>
												<SelectItem value='home'>
													Home & Garden
												</SelectItem>
												<SelectItem value='toys'>
													Toys & Games
												</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											Choose the category that best fits the product.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* <FormField
								control={form.control}
								name='image'
								render={({ field: { onChange, value, ...rest } }) => (
									<FormItem>
										<FormLabel>Product Image</FormLabel>
										<FormControl>
											<Input
												type='file'
												accept='image/*'
												onChange={(e) => onChange(e.target.files)}
												{...rest}
											/>
										</FormControl>
										<FormDescription>
											Upload a clear image of the product.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/> */}
							<Button type='submit' disabled={isProductAdditionPending}>
								{isProductAdditionPending ? (
									<>
										<Upload className='mr-2 h-4 w-4 animate-spin' />
										Uploading...
									</>
								) : (
									'Add Product'
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
			{isProductAdditionSuccess && (
				<Alert variant='default' className='mt-4 max-w-2xl mx-auto'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Success</AlertTitle>
					<AlertDescription>
						The product has been successfully added to the store.
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
