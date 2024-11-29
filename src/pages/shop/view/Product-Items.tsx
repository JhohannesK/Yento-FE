import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	ShoppingCart,
	Heart,
	Star,
	ChevronLeft,
	Plus,
	Minus,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AdditionalProductDetails from '@/components/additional-product-details';
import { ICart, IProductVariant, ProductResponseType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/lib/appContext';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductDetails() {
	const [quantity, setQuantity] = useState(1);
	const { productData, productImage, index } = useLocation().state as {
		productData: ProductResponseType;
		productImage: string[];
		index: number;
	};
	const { setAddToCart, cart } = useAppContext();
	const alreadyAdded = cart.some((item) => item.id == productData.id);

	function addToCart() {
		const data: ICart = {
			category: productData.category,
			description: productData.description,
			id: productData.id,
			name: productData.name,
			price: productData.price,
			tags: productData.tags ?? [],
			quantity,
			variant: selectedVariant,
		};
		setAddToCart((prev) => [...prev, data]);
	}

	const [isAddedToWishlist, addToWishlist] = useState(false);

	const incrementQuantity = () => setQuantity((prev) => prev + 1);
	const decrementQuantity = () =>
		setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
	const [selectedVariant, setSelectedVariant] = useState<IProductVariant>(
		productData.variants[0]
	);

	return (
		<div className='container px-4 py-8 mx-auto'>
			<div className='w-full flex items-center justify-between'>
				<Link
					to='/shop/home'
					className='inline-flex items-center mb-4 text-sm font-medium text-muted-foreground hover:text-primary'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Back to Home
				</Link>
			</div>
			<div className='grid gap-8 md:grid-cols-2'>
				<div className='space-y-4'>
					<div className='overflow-hidden rounded-lg aspect-square'>
						<img
							src={productImage[index] || '/general-image.jpg'}
							alt='Product Image'
							className='object-cover w-full h-full'
						/>
					</div>
					<div className='grid grid-cols-4 gap-4'>
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className='overflow-hidden rounded-lg aspect-square'
							>
								<img
									src='/general-image.jpg'
									alt={`Product Image ${i}`}
									className='object-cover w-full h-full'
								/>
							</div>
						))}
					</div>
				</div>
				<div className='space-y-6'>
					<div>
						<h1 className='text-3xl font-bold capitalize'>
							{productData.name ?? 'Premium Wireless Headphones'}
						</h1>
						<div className='flex items-center mt-2'>
							<div className='flex items-center'>
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className='w-5 h-5 fill-primary text-primary'
									/>
								))}
							</div>
							<span className='ml-2 text-sm text-muted-foreground'>
								(128 reviews)
							</span>
						</div>
					</div>
					<div className='text-4xl font-bold'>
						${productData.price ?? 299.99}
					</div>
					<p className='text-muted-foreground'>
						{productData.description ??
							'Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise-cancellation technology and long-lasting battery life, these headphones are perfect for music lovers and professionals alike.'}
					</p>
					<div className='space-y-4'>
						<div className='space-y-4'>
							<div>
								<h3 className='mb-2 text-lg font-semibold'>
									Select Variant
								</h3>
								<div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
									{productData.variants.map((variant) => (
										<Card
											key={variant.sku}
											className={cn(
												'cursor-pointer transition-all',
												selectedVariant?.sku === variant.sku
													? 'ring-2 ring-primary'
													: ''
											)}
											onClick={() => setSelectedVariant(variant)}
										>
											<CardContent className='p-4'>
												<div className='font-semibold'>
													{variant.color}
												</div>
												<div className='text-sm text-muted-foreground'>
													{variant.size}
												</div>
												<div className='mt-2 text-sm font-medium'>
													{variant.priceModifier > 0
														? `+$${variant.priceModifier.toFixed(
																2
														  )}`
														: 'No extra cost'}
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</div>
						<div className='flex items-center gap-x-2'>
							<p className='block text-sm font-medium'>In Stock:</p>
							<p>{productData.stockQuantity}</p>
						</div>
						<div>
							<label
								htmlFor='quantity'
								className='block mb-2 text-sm font-medium'
							>
								Quantity
							</label>
							<div className='flex items-center space-x-2'>
								<Button
									variant='outline'
									size='icon'
									onClick={decrementQuantity}
								>
									<Minus className='w-4 h-4' />
								</Button>
								<Input
									type='number'
									id='quantity'
									className='w-20 text-center'
									value={quantity}
									onChange={(e) =>
										setQuantity(parseInt(e.target.value) || 1)
									}
									min='1'
								/>
								<Button
									variant='outline'
									size='icon'
									onClick={incrementQuantity}
								>
									<Plus className='w-4 h-4' />
								</Button>
							</div>
						</div>
					</div>
					<div className='flex space-x-4'>
						<Button
							disabled={alreadyAdded || !selectedVariant}
							onClick={addToCart}
							className='flex-1'
						>
							<ShoppingCart className='w-4 h-4 mr-2' />{' '}
							{alreadyAdded ? 'Added to cart' : 'Add to Cart'}
						</Button>
						<Button
							variant='outline'
							onClick={() => addToWishlist(!isAddedToWishlist)}
						>
							<Heart
								className={cn(
									isAddedToWishlist ? 'fill-red-500' : '',
									'w-4 h-4 mr-2'
								)}
							/>{' '}
							Add to Wishlist
						</Button>
					</div>
				</div>
			</div>
			<AdditionalProductDetails name={productData.name} />
		</div>
	);
}
