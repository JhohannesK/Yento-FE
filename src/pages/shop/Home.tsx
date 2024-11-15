import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/api/axios';
import { ProductResponseType } from '@/lib/types';
import { loadFromLocalStorage } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { getUnsplashImage } from '@/lib/api/product';
import { Badge } from '@/components/ui/badge';

export default function Home() {
	const user = loadFromLocalStorage({ key: 'user' });
	const navigate = useNavigate();
	const { data: products } = useQuery<ProductResponseType[]>({
		queryKey: ['get-all-products'],
		queryFn: async () => {
			return (await axiosInstance.get('/products')).data;
		},
	});
	console.log('🚀 ~ Home ~ data:', products);

	const productImageQueries = products?.map((product) => ({
		queryKey: ['productImage', product.id],
		queryFn: () => getUnsplashImage(product.name, product.category),
	}));

	const { data: productImage = [] } = useQuery({
		queryKey: ['productImages'],
		queryFn: async () => {
			const imagePromises = productImageQueries?.map((query) =>
				query.queryFn()
			);
			return Promise.all(imagePromises as unknown[]);
		},
		enabled: products && products?.length > 0,
	});

	const handleNavigation = (product: ProductResponseType, index: number) => {
		navigate(`/shop/item/${product.id}`, {
			state: { productData: product, productImage, index },
		});
	};
	return (
		<main className='flex-1'>
			<section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted'>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center space-y-4 text-center'>
						<div className='space-y-2'>
							<h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
								Welcome to Yeton, {user.userName}
							</h1>
							<p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
								Discover amazing products at unbeatable prices. Start
								shopping now and enjoy free shipping on orders over $50!
							</p>
						</div>
						<div className='space-x-4'>
							{user.role === 'User' ? (
								<Button onClick={() => navigate('#')}>Shop Now</Button>
							) : (
								<Button onClick={() => navigate('/shop/admin/home')}>
									Add Item
								</Button>
							)}
							<Button variant='outline'>Learn More</Button>
						</div>
					</div>
				</div>
			</section>
			<section className='w-full py-12 md:py-24 lg:py-32'>
				<div className='container px-4 md:px-6'>
					<h2 className='mb-8 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
						Featured Products
					</h2>
					<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
						{products?.map((product, index) => (
							<Card
								key={product.id}
								className='cursor-pointer relative pt-1'
								onClick={() => handleNavigation(product, index)}
							>
								<div className='absolute top-0.5 right-6'>
									<Badge variant='default'>Badge</Badge>
								</div>
								<CardHeader>
									<img
										src={
											(productImage[index] as string) ||
											`/general-image.jpg`
										}
										alt={`Product ${product}`}
										className='object-cover w-full h-48'
									/>
								</CardHeader>
								<CardContent>
									<CardTitle> {product.name.toUpperCase()}</CardTitle>
									<p className='text-muted-foreground'>
										Lorem ipsum dolor sit amet, consectetur adipiscing
										elit.
									</p>
								</CardContent>
								<CardFooter className='flex justify-between'>
									<span className='font-bold'>${product.price}</span>
									<Button
										variant='outline'
										size='sm'
										onClick={(e) => e.stopPropagation()}
									>
										Add to Cart
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</section>
			<section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
				<div className='container px-4 md:px-6'>
					<div className='flex flex-col items-center space-y-4 text-center'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
							Subscribe to Our Newsletter
						</h2>
						<p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
							Stay updated with our latest products and exclusive offers.
						</p>
						<div className='w-full max-w-sm space-y-2'>
							<form className='flex space-x-2'>
								<Input
									type='email'
									placeholder='Enter your email'
									className='flex-1 max-w-lg'
								/>
								<Button type='submit'>Subscribe</Button>
							</form>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
