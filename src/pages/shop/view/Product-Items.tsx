import { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AdditionalProductDetails from '@/components/additional-product-details';
import { ICart, IProductVariant, ProductResponseType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/lib/appContext';
import { Card, CardContent } from '@/components/ui/card';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '@/lib/api/wishlist';
import { isAuthenticated } from '@/lib/auth';
import { toast } from 'sonner';

export default function ProductDetails() {
	const [quantity, setQuantity] = useState(1);
	const navigate = useNavigate();
	const { productData, productImage, index } = useLocation().state as {
		productData: ProductResponseType;
		productImage: ProductResponseType[] | string[];
		index: number;
	};
	const { setAddToCart, cart } = useAppContext();
	const alreadyAdded = cart.some((item) => item.id == productData.id);
	const authenticated = isAuthenticated();
	const queryClient = useQueryClient();

	const { data: wishlistIds = [] } = useQuery({
		queryKey: ['wishlist-ids'],
		queryFn: getWishlistIds,
		enabled: authenticated,
	});
	const isInWishlist = authenticated && wishlistIds.includes(productData.id);

	const addWishlistMutation = useMutation({
		mutationFn: addToWishlist,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['wishlist-ids'] });
			queryClient.invalidateQueries({ queryKey: ['wishlist'] });
			toast.success('Added to wishlist');
		},
	});
	const removeWishlistMutation = useMutation({
		mutationFn: removeFromWishlist,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['wishlist-ids'] });
			queryClient.invalidateQueries({ queryKey: ['wishlist'] });
			toast.success('Removed from wishlist');
		},
	});

	function addToCart() {
		const data: ICart = {
			category: productData.category,
			description: productData.description,
			id: productData.id,
			name: productData.name,
			price: productData.price,
			tags: productData.tags ?? [],
			quantity,
			variant: selectedVariant as ICart['variant'],
		};
		setAddToCart((prev) => [...prev, data]);
	}

	function toggleWishlist() {
		if (!authenticated) {
			navigate('/auth?auth=signin');
			return;
		}
		if (isInWishlist) removeWishlistMutation.mutate(productData.id);
		else addWishlistMutation.mutate(productData.id);
	}

	const incrementQuantity = () => setQuantity((prev) => prev + 1);
	const decrementQuantity = () =>
		setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
	const [selectedVariant, setSelectedVariant] = useState<IProductVariant>(
		productData.variants[0]
	);
	const imageFallback =
		Array.isArray(productImage) && typeof productImage[index] === 'object' && productImage[index] != null
			? (productImage[index] as ProductResponseType).imageUrls?.[0]
			: null;
	const images = productData.imageUrls?.length
		? productData.imageUrls
		: imageFallback
			? [imageFallback]
			: ['/general-image.jpg'];
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	return (
		<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
			<div className='w-full flex items-center justify-between'>
				<Link
					to='/shop/home'
					className='inline-flex items-center mb-4 text-sm font-medium text-muted-foreground hover:text-primary'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Back to Home
				</Link>
			</div>
			<div className="grid gap-6 sm:gap-8 md:grid-cols-2">
				<div className='space-y-4'>
					<div className='overflow-hidden rounded-lg aspect-square'>
						<img
							src={images[selectedImageIndex]}
							alt='Product Image'
							className='object-cover w-full h-full'
						/>
					</div>
					{images.length > 1 && (
						<div className='grid grid-cols-4 gap-4'>
							{images.map((src, i) => (
								<button
									key={src}
									type='button'
									onClick={() => setSelectedImageIndex(i)}
									className={cn(
										'overflow-hidden rounded-lg aspect-square border-2',
										selectedImageIndex === i
											? 'border-primary'
											: 'border-transparent'
									)}
								>
									<img
										src={src}
										alt={`Product ${i + 1}`}
										className='object-cover w-full h-full'
									/>
								</button>
							))}
						</div>
					)}
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
							onClick={toggleWishlist}
							disabled={addWishlistMutation.isPending || removeWishlistMutation.isPending}
						>
							<Heart
								className={cn(
									isInWishlist ? 'fill-red-500 text-red-500' : '',
									'w-4 h-4 mr-2'
								)}
							/>
							{authenticated ? (isInWishlist ? 'In wishlist' : 'Add to Wishlist') : 'Sign in to wishlist'}
						</Button>
					</div>
				</div>
			</div>
			<AdditionalProductDetails name={productData.name} />
		</div>
	);
}
