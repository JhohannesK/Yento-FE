import { Button } from '@/components/ui/button';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/api/axios';
import {
	type ApiResponse,
	ICart,
	primaryVariantForCart,
	ProductResponseType,
} from '@/lib/types';
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
			variant: primaryVariantForCart(productData),
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
		<main className="flex min-h-0 min-w-0 flex-1 flex-col">
			<section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 xl:py-40 bg-muted">
				<div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
					<div className="flex flex-col items-center gap-4 text-center sm:gap-6">
						<div className="space-y-2 sm:space-y-3">
							<h1 className="text-balance text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/none">
								Welcome to Yeton
								{authenticated &&
								user &&
								user !== false &&
								'userName' in (user as object)
									? `, ${(user as { userName: string }).userName}`
									: ''}
							</h1>
							<p className="mx-auto max-w-[42rem] text-pretty text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
								Discover amazing products at unbeatable prices. Start shopping
								now and enjoy free shipping on orders over $50!
							</p>
						</div>
						<div className="flex w-full max-w-md flex-col gap-2 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
							{authenticated &&
							user &&
							user !== false &&
							(user as { role?: string }).role === 'Admin' ? (
								<Button
									className="w-full sm:w-auto"
									onClick={() => navigate('/shop/admin/home')}
								>
									Add Item
								</Button>
							) : (
								<Button
									className="w-full sm:w-auto"
									onClick={() => navigate('/shop/search')}
								>
									Shop Now
								</Button>
							)}
							<Button variant="outline" className="w-full sm:w-auto">
								Learn More
							</Button>
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
