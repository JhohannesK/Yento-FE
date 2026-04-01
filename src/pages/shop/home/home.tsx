import { Button } from '@/components/ui/button';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/api/axios';
import { type ApiResponse, ICart, ProductResponseType } from '@/lib/types';
import { isAuthenticated } from '@/lib/auth';
import { loadFromLocalStorage } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/appContext';
import useProduct from '@/lib/hooks/useProduct';
import { useState } from 'react';
import Newsletter from './newsletter';
import FeaturedProducts from './featured-products';

export default function Home() {
	const user = loadFromLocalStorage({ key: 'user' });
	const authenticated = isAuthenticated();
	const [categorySelected, setCategorySelected] = useState('All');
	const navigate = useNavigate();
	const { categories } = useProduct();
	const { setAddToCart } = useAppContext();
	const { data: products, isPending: isProductsPending } = useQuery<
		ProductResponseType[]
	>({
		queryKey: ['get-all-products', categorySelected],
		queryFn: async () => {
			const url =
				categorySelected && categorySelected !== 'All'
					? `/products/get-all-products?category=${encodeURIComponent(categorySelected)}`
					: '/products/get-all-products';
			const res =
				await axiosInstance.get<ApiResponse<ProductResponseType[]>>(url);
			return res.data.data ?? [];
		},
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
	}

	const { data: productImage } = useQuery<ProductResponseType[]>({
		queryKey: ['get-all-products', 'all'],
		queryFn: async () => {
			const { getProducts } = await import('@/lib/api/product');
			return await getProducts();
		},
	});

	const handleNavigation = (product: ProductResponseType, index: number) => {
		navigate(`/shop/item/${product.id}`, {
			state: { productData: product, productImage: productImage ?? [], index },
		});
	};
	return (
		<main className="flex-1">
			<section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
				<div className="container px-4 sm:px-6 min-w-6xl mx-auto">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/none">
								Welcome to Yeton
								{authenticated &&
								user &&
								user !== false &&
								'userName' in (user as object)
									? `, ${(user as { userName: string }).userName}`
									: ''}
							</h1>
							<p className="mx-auto max-w-[700px] text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl px-2">
								Discover amazing products at unbeatable prices. Start shopping
								now and enjoy free shipping on orders over $50!
							</p>
						</div>
						<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
							{authenticated &&
							user &&
							user !== false &&
							(user as { role?: string }).role === 'Admin' ? (
								<Button onClick={() => navigate('/shop/admin/home')}>
									Add Item
								</Button>
							) : (
								<Button onClick={() => navigate('#')}>Shop Now</Button>
							)}
							<Button variant="outline">Learn More</Button>
						</div>
					</div>
				</div>
			</section>
			<FeaturedProducts
				categories={categories ?? []}
				products={products ?? []}
				isLoading={isProductsPending}
				setCategorySelected={setCategorySelected}
				handleNavigation={handleNavigation}
				addToCart={addToCart}
				productImage={productImage ?? ([] as ProductResponseType[])}
			/>
			<Newsletter />
		</main>
	);
}
