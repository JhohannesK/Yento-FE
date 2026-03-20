import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { getWishlist, removeFromWishlist } from '@/lib/api/wishlist';
import { isAuthenticated } from '@/lib/auth';
import { ICart, ProductResponseType } from '@/lib/types';
import { useAppContext } from '@/lib/appContext';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
	const authenticated = isAuthenticated();
	const { setAddToCart } = useAppContext();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: products, isPending } = useQuery({
		queryKey: ['wishlist'],
		queryFn: getWishlist,
		enabled: authenticated,
	});

	const removeMutation = useMutation({
		mutationFn: removeFromWishlist,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['wishlist'] });
			queryClient.invalidateQueries({ queryKey: ['wishlist-ids'] });
			toast.success('Removed from wishlist');
		},
		onError: () => toast.error('Failed to remove'),
	});

	function addToCart(productData: ProductResponseType) {
		const data: ICart = {
			category: productData.category,
			description: productData.description,
			id: productData.id,
			name: productData.name,
			price: productData.price,
			tags: productData?.tags ?? [],
			quantity: 1,
			variant: productData.variants[0],
		};
		setAddToCart((prev) => [...prev, data]);
		toast.success('Added to cart');
	}

	if (!authenticated) {
		return (
			<main className="w-full max-w-360 mx-auto py-12 px-4 md:px-6 text-center">
				<h1 className="text-2xl font-bold mb-4">Your wishlist</h1>
				<p className="text-muted-foreground mb-6">Sign in to view and manage your wishlist.</p>
				<Button onClick={() => navigate('/auth?auth=signin')}>Sign In</Button>
			</main>
		);
	}

	return (
		<main className="w-full max-w-360 mx-auto py-8 px-4 md:px-6">
			<h1 className="text-2xl font-bold mb-6">Your wishlist</h1>

			{isPending ? (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<Card key={index} className="relative">
							<CardHeader className="p-0">
								<div className="overflow-hidden rounded-lg">
									<Skeleton className="h-48 w-full" />
								</div>
							</CardHeader>
							<CardContent>
								<Skeleton className="h-5 w-4/5 mb-2" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-11/12 mt-2" />
							</CardContent>
							<CardFooter className="flex justify-between">
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-8 w-28 rounded-md" />
							</CardFooter>
						</Card>
					))}
				</div>
			) : products?.length === 0 ? (
				<div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
					<Heart className="h-12 w-12 text-primary mb-4 animate-[gentleFloat_2.4s_ease-in-out_infinite]" />
					<h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
					<p className="text-muted-foreground max-w-[520px]">
						Favorite something you love and it will show up here for quick access.
					</p>
					<div className="mt-6">
						<Button asChild size="lg">
							<Link to="/shop/search">Browse products</Link>
						</Button>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{products?.map((product, index) => (
						<Card
							key={product.id}
							className="relative interactive group opacity-0 animate-[fadeInUp_400ms_var(--ease-spring)_forwards]"
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-2 right-2 z-10"
								onClick={() => removeMutation.mutate(product.id)}
								disabled={removeMutation.isPending}
								aria-label="Remove from wishlist"
							>
								<Heart className="h-5 w-5 fill-red-500 text-red-500" />
							</Button>
							<CardHeader
								className="cursor-pointer"
								onClick={() =>
									navigate(`/shop/item/${product.id}`, {
										state: { productData: product, productImage: products ?? [], index },
									})
								}
							>
								<img
									src={product.imageUrls?.[0] ?? '/general-image.jpg'}
									alt={product.name}
									className="object-cover w-full h-48"
								/>
							</CardHeader>
							<CardContent
								className="cursor-pointer"
								onClick={() =>
									navigate(`/shop/item/${product.id}`, {
										state: { productData: product, productImage: products ?? [], index },
									})
								}
							>
								<CardTitle className="text-base">{product.name}</CardTitle>
								<p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
							</CardContent>
							<CardFooter className="flex justify-between">
								<span className="font-bold">${product.price}</span>
								<Button
									variant="outline"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										addToCart(product);
									}}
								>
									Add to Cart
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</main>
	);
}
