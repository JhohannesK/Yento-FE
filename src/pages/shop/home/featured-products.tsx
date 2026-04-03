import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductResponseType } from '@/lib/types';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedProducts = ({
	categories,
	products,
	setCategorySelected,
	handleNavigation,
	addToCart,
	productImage,
	isLoading,
}: {
	categories: { id: number; name: string }[];
	products: ProductResponseType[];
	setCategorySelected: (category: string) => void;
	handleNavigation: (product: ProductResponseType, index: number) => void;
	addToCart: (product: ProductResponseType) => void;
	productImage: ProductResponseType[];
	isLoading?: boolean;
}) => {
	const navigate = useNavigate();

	return (
		<section className="mx-auto w-full max-w-[90rem] py-8 sm:py-12 md:py-24 lg:py-32">
			<div className="container min-w-0 px-4 md:px-6">
				<h2 className="mb-4 text-balance text-2xl font-bold tracking-tighter sm:mb-6 sm:text-3xl md:mb-8 md:text-4xl lg:text-5xl">
					Featured Products
				</h2>
				<div className="mb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
					<Tabs defaultValue="all">
						<div className="overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
							<TabsList className="inline-flex h-auto min-h-9 w-max max-w-none flex-nowrap gap-1">
								<TabsTrigger
									onClick={() => setCategorySelected('All')}
									value="all"
								>
									All
								</TabsTrigger>
								{categories?.map((category) => (
									<TabsTrigger
										key={category.id}
										onClick={() => setCategorySelected(category.name)}
										value={category.name.toLowerCase()}
									>
										{category.name}
									</TabsTrigger>
								))}
							</TabsList>
						</div>
					</Tabs>
				</div>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{isLoading ? (
						Array.from({ length: 8 }).map((_, index) => (
							<Card
								key={index}
								className="pt-1 relative"
							>
								<div className="absolute top-0.5 right-3 z-10 flex max-w-[45%] flex-wrap justify-end gap-1 sm:right-6 sm:max-w-none sm:flex-nowrap">
									<Skeleton className="h-5 w-14 rounded-full" />
									<Skeleton className="h-5 w-10 rounded-full" />
								</div>
								<CardHeader className="p-0">
									<div className="overflow-hidden rounded-lg">
										<Skeleton className="h-48 w-full" />
									</div>
								</CardHeader>
								<CardContent className="min-w-0">
									<Skeleton className="h-5 w-4/5 mb-2" />
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-11/12" />
								</CardContent>
								<CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<Skeleton className="h-5 w-16" />
									<Skeleton className="h-8 w-full rounded-md sm:w-28" />
								</CardFooter>
							</Card>
						))
					) : products?.length === 0 ? (
						<div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
							<Package className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-xl font-bold mb-2">Nothing to show yet</h3>
							<p className="text-muted-foreground max-w-[520px]">
								Try a different category or browse the full catalog.
							</p>
							<div className="mt-6">
								<Button
									onClick={() => navigate('/shop/search')}
									size="lg"
								>
									Browse All
								</Button>
							</div>
						</div>
					) : (
						products?.map((product, index) => (
							<Card
								key={product.id}
								className="cursor-pointer relative pt-1 interactive group opacity-0 animate-[fadeInUp_400ms_var(--ease-spring)_forwards]"
								style={{ animationDelay: `${index * 50}ms` }}
								onClick={() => handleNavigation(product, index)}
							>
								<div className="absolute top-0.5 right-3 z-10 flex max-w-[45%] flex-wrap justify-end gap-1 sm:right-6 sm:max-w-none sm:flex-nowrap">
									{product.tags?.map((tag) => (
										<Badge
											key={tag}
											variant="default"
											className="capitalize"
										>
											{tag}
										</Badge>
									))}
								</div>
								<CardHeader className="p-0">
									<div className="overflow-hidden rounded-lg">
										<img
											src={
												product.imageUrls?.[0] ??
												productImage?.[index]?.imageUrls?.[0] ??
												`/general-image.jpg`
											}
											alt={`Product ${product.name}`}
											className="object-cover w-full h-48 transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.05]"
										/>
									</div>
								</CardHeader>
								<CardContent className="min-w-0 pt-4">
									<CardTitle className="line-clamp-2 text-base leading-snug sm:text-lg">
										{product.name.toUpperCase()}
									</CardTitle>
									<p className="text-muted-foreground line-clamp-2 text-sm sm:text-base">
										{product.description}
									</p>
								</CardContent>
								<CardFooter className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
									<span className="text-lg font-bold tabular-nums sm:text-base">
										{product.price.toLocaleString('en-US', {
											style: 'currency',
											currency: 'GHS',
										})}
									</span>
									<Button
										variant="outline"
										size="sm"
										className="w-full shrink-0 sm:w-auto"
										onClick={(e) => {
											e.stopPropagation();
											addToCart(product);
										}}
									>
										Add to Cart
									</Button>
								</CardFooter>
							</Card>
						))
					)}
				</div>
			</div>
		</section>
	);
};

export default FeaturedProducts;
