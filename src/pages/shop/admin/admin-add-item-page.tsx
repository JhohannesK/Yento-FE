import { useFieldArray, useForm } from 'react-hook-form';
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
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { addNewProductFormSchema } from '@/lib/schema';
import { AddNewProduct, ProductResponseType } from '@/lib/types';
import useProduct from '@/lib/hooks/useProduct';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Upload, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/cloudinary';
import { toast } from 'sonner';
import { useState, useRef } from 'react';

export default function AdminNewItem() {
	const {
		addNewProduct,
		editProduct,
		isProductEditingPending,
		isProductAdditionPending,
		// isProductAdditionSuccess,
		categories,
	} = useProduct();
	const [searchParams] = useSearchParams();
	const editMode = searchParams.get('editMode');
	const locationData = useLocation()?.state as {
		product: ProductResponseType;
	};
	const productData = locationData?.product;
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<AddNewProduct>({
		resolver: zodResolver(addNewProductFormSchema),
		defaultValues: {
			name: productData?.name ?? '',
			stockQuantity: productData?.stockQuantity ?? 0,
			minimumStockLevel: productData?.minimumStockLevel ?? 0,
			price: productData?.price ?? 0,
			category: productData?.category ?? '',
			description: productData?.description ?? '',
			imageUrls: productData?.imageUrls ?? [],
			tags: [],
			variants: productData?.variants ?? [],
		},
	});

	const imageUrls = form.watch('imageUrls') ?? [];

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files?.length) return;
		setIsUploading(true);
		try {
			let current = form.getValues('imageUrls') ?? [];
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (!file.type.startsWith('image/')) continue;
				const url = await uploadImage(file);
				current = [...current, url];
				form.setValue('imageUrls', current);
			}
			toast.success('Image(s) uploaded');
		} catch {
			toast.error('Image upload failed');
		} finally {
			setIsUploading(false);
			e.target.value = '';
		}
	}

	function removeImage(index: number) {
		form.setValue(
			'imageUrls',
			imageUrls.filter((_, i) => i !== index)
		);
	}

	const { fields, append, remove } = useFieldArray({
		name: 'variants',
		control: form.control,
	});

	function onSubmit(values: AddNewProduct) {
		if (editMode) {
			editProduct({
				product: values,
				productId: productData.id,
			});
		} else {
			addNewProduct(values);
		}
	}

	return (
		<div className='container mx-auto px-4 py-8 flex-1 lg:w-[120rem]'>
			<Link
				to='/shop/home'
				className='inline-flex items-center mb-4 text-sm font-medium text-muted-foreground hover:text-primary'
			>
				<ChevronLeft className='w-4 h-4 mr-2' />
				Back to Home
			</Link>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<Card>
						<CardHeader>
							<CardTitle>Add New Product</CardTitle>
							<CardDescription>
								Enter the details of the new product to add to the
								inventory.
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Product Name</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter product name'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='stockQuantity'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Stock Quantity</FormLabel>
											<FormControl>
												<Input
													type='number'
													{...field}
													onChange={(e) =>
														field.onChange(
															parseInt(e.target.value, 10)
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='minimumStockLevel'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Minimum Stock Level</FormLabel>
											<FormControl>
												<Input
													type='number'
													{...field}
													onChange={(e) =>
														field.onChange(
															parseInt(e.target.value, 10)
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='price'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price</FormLabel>
											<FormControl>
												<Input
													type='number'
													step='0.01'
													{...field}
													onChange={(e) =>
														field.onChange(
															parseFloat(e.target.value)
														)
													}
												/>
											</FormControl>
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
													{categories?.map((category, index) => (
														<SelectItem
															key={index}
															value={category.name}
														>
															{category.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Enter product description'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='imageUrls'
								render={() => (
									<FormItem>
										<FormLabel>Product Images (e.g. per variant)</FormLabel>
										<FormControl>
											<div className='space-y-2'>
												<input
													ref={fileInputRef}
													type='file'
													accept='image/*'
													multiple
													className='hidden'
													onChange={handleFileChange}
													disabled={isUploading}
												/>
												<Button
													type='button'
													variant='outline'
													onClick={() => fileInputRef.current?.click()}
													disabled={isUploading}
												>
													{isUploading ? (
														<Loader2 className='h-4 w-4 animate-spin' />
													) : (
														<Upload className='h-4 w-4 mr-2' />
													)}
													{isUploading ? 'Uploading…' : 'Add image(s)'}
												</Button>
												{imageUrls.length > 0 && (
													<div className='mt-2 flex flex-wrap gap-2'>
														{imageUrls.map((url, idx) => (
															<div key={url} className='relative'>
																<img
																	src={url}
																	alt={`Preview ${idx + 1}`}
																	className='h-32 w-32 object-cover rounded border'
																/>
																<Button
																	type='button'
																	variant='destructive'
																	size='icon'
																	className='absolute -top-2 -right-2 h-6 w-6'
																	onClick={() => removeImage(idx)}
																>
																	×
																</Button>
															</div>
														))}
													</div>
												)}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='tags'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tags</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter tags separated by commas'
												{...field}
												onChange={(e) =>
													field.onChange(
														e.target.value
															.split(',')
															.map((tag) => tag.trim())
													)
												}
											/>
										</FormControl>
										<FormDescription>
											Enter tags separated by commas
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div>
								<h3 className='text-lg font-medium mb-2'>Variants</h3>
								{fields.map((field, index) => (
									<Card key={field.id} className='mb-4'>
										<CardContent className='pt-6'>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												<FormField
													control={form.control}
													name={`variants.${index}.size`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Size</FormLabel>
															<FormControl>
																<Input {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`variants.${index}.color`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Color</FormLabel>
															<FormControl>
																<Input {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`variants.${index}.sku`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>SKU</FormLabel>
															<FormControl>
																<Input {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`variants.${index}.weight`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Weight</FormLabel>
															<FormControl>
																<Input {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`variants.${index}.priceModifier`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																Price Modifier
															</FormLabel>
															<FormControl>
																<Input
																	type='number'
																	step='0.01'
																	{...field}
																	onChange={(e) =>
																		field.onChange(
																			parseFloat(
																				e.target.value
																			)
																		)
																	}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<Button
												type='button'
												variant='destructive'
												className='mt-2'
												onClick={() => remove(index)}
											>
												Remove Variant
											</Button>
										</CardContent>
									</Card>
								))}
								<Button
									type='button'
									variant='outline'
									disabled={
										isProductAdditionPending ||
										isProductEditingPending
									}
									onClick={() =>
										append({
											size: '',
											color: '',
											sku: '',
											priceModifier: 0,
											weight: '',
										})
									}
								>
									Add Variant
								</Button>
							</div>
						</CardContent>
						<CardFooter>
							<Button
								disabled={
									isProductAdditionPending || isProductEditingPending
								}
								type='submit'
							>
								{editMode ? 'Update Product' : 'Add Product'}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</div>
	);
}
