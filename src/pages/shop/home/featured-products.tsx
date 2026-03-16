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
import { ProductResponseType } from '@/lib/types';

const FeaturedProducts = ({
	categories,
	products,
	setCategorySelected,
	handleNavigation,
	addToCart,
	productImage,
}: {
	categories: { id: number; name: string }[];
	products: ProductResponseType[];
	setCategorySelected: (category: string) => void;
	handleNavigation: (product: ProductResponseType, index: number) => void;
	addToCart: (product: ProductResponseType) => void;
	productImage: ProductResponseType[];
}) => {
	return (
		<section className="w-full max-w-[90rem] mx-auto py-8 sm:py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6">
				<h2 className="mb-4 sm:mb-6 md:mb-8 text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
					Featured Products
				</h2>
				<div className="mb-3">
					<Tabs defaultValue="all">
						<TabsList>
							<TabsTrigger
								onClick={() => setCategorySelected('All')}
								value="all"
							>
								All
							</TabsTrigger>
							<TabsTrigger
								onClick={() => setCategorySelected('Men')}
								value="men"
							>
								Men
							</TabsTrigger>
							<TabsTrigger
								onClick={() => setCategorySelected('Women')}
								value="women"
							>
								Women
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
					</Tabs>
				</div>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{products?.length === 0 ? (
						<div className=" flex items-center justify-center flex-col">
							<div className="flex w-full items-center justify-center">
								<p className="text-xl font-bold">No products available yet</p>
							</div>
						</div>
					) : (
						<>
							{products?.map((product, index) => {
								return (
									<Card
										key={product.id}
										className="cursor-pointer relative pt-1"
										onClick={() => handleNavigation(product, index)}
									>
										<div className="absolute top-0.5 right-6 flex gap-x-1">
											{product.tags?.map((tag) => (
												<Badge
													variant="default"
													className="capitalize"
												>
													{tag}
												</Badge>
											))}
										</div>
										<CardHeader>
											<img
												src={
													product.imageUrls?.[0] ??
													productImage?.[index]?.imageUrls?.[0] ??
													`/general-image.jpg`
												}
												alt={`Product ${product.name}`}
												className="object-cover w-full h-48"
											/>
										</CardHeader>
										<CardContent>
											<CardTitle> {product.name.toUpperCase()}</CardTitle>
											<p className="text-muted-foreground">
												Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											</p>
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
								);
							})}
						</>
					)}
				</div>
			</div>
		</section>
	);
};

export default FeaturedProducts;
