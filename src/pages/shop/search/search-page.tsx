import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { searchProducts, type SearchParams } from '@/lib/api/product';
import useProduct from '@/lib/hooks/useProduct';
import { ICart, ProductResponseType } from '@/lib/types';
import { useAppContext } from '@/lib/appContext';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const q = searchParams.get('q') ?? '';
	const [keyword, setKeyword] = useState(q);
	const [category, setCategory] = useState<string>(searchParams.get('category') ?? 'All');
	const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') ?? '');
	const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') ?? '');
	const [sort, setSort] = useState<'price_asc' | 'price_desc'>(
		(searchParams.get('sort') as 'price_asc' | 'price_desc') ?? 'price_asc'
	);

	const { categories } = useProduct();
	const { setAddToCart } = useAppContext();
	const navigate = useNavigate();

	const params: SearchParams = {
		q: keyword.trim() || undefined,
		category: category !== 'All' ? category : undefined,
		minPrice: minPrice ? Number(minPrice) : undefined,
		maxPrice: maxPrice ? Number(maxPrice) : undefined,
		sort,
	};

	const { data: products, isPending } = useQuery<ProductResponseType[]>({
		queryKey: ['search', params],
		queryFn: () => searchProducts(params),
	});

	const applyFilters = () => {
		const next = new URLSearchParams();
		if (keyword.trim()) next.set('q', keyword.trim());
		if (category !== 'All') next.set('category', category);
		if (minPrice) next.set('minPrice', minPrice);
		if (maxPrice) next.set('maxPrice', maxPrice);
		next.set('sort', sort);
		setSearchParams(next);
	};

	const clearFilters = () => {
		setKeyword('');
		setCategory('All');
		setMinPrice('');
		setMaxPrice('');
		setSort('price_asc');
		setSearchParams(new URLSearchParams());
	};

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

	return (
		<main className="w-full max-w-360 mx-auto py-8 px-4 md:px-6">
			<h1 className="text-2xl font-bold mb-6">Search products</h1>

			<div className="flex flex-col gap-4 mb-6">
				<div className="flex flex-wrap gap-2 items-end">
					<div className="flex-1 min-w-[200px]">
						<label className="text-sm text-muted-foreground">Keyword</label>
						<Input
							placeholder="Name or description..."
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
							className="mt-1"
						/>
					</div>
					<div className="w-[140px]">
						<label className="text-sm text-muted-foreground">Category</label>
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger className="mt-1">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								{categories?.map((c) => (
									<SelectItem key={c.id} value={c.name}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="w-[100px]">
						<label className="text-sm text-muted-foreground">Min $</label>
						<Input
							type="number"
							min={0}
							step={0.01}
							placeholder="0"
							value={minPrice}
							onChange={(e) => setMinPrice(e.target.value)}
							className="mt-1"
						/>
					</div>
					<div className="w-[100px]">
						<label className="text-sm text-muted-foreground">Max $</label>
						<Input
							type="number"
							min={0}
							step={0.01}
							placeholder="Any"
							value={maxPrice}
							onChange={(e) => setMaxPrice(e.target.value)}
							className="mt-1"
						/>
					</div>
					<div className="w-[140px]">
						<label className="text-sm text-muted-foreground">Sort</label>
						<Select
							value={sort}
							onValueChange={(v) => setSort(v as 'price_asc' | 'price_desc')}
						>
							<SelectTrigger className="mt-1">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="price_asc">Price: low to high</SelectItem>
								<SelectItem value="price_desc">Price: high to low</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button onClick={applyFilters}>Apply</Button>
				</div>
			</div>

			{isPending ? (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<Card key={index} className="pt-1">
							<CardHeader className="p-0">
								<div className="overflow-hidden rounded-lg">
									<Skeleton className="h-48 w-full" />
								</div>
							</CardHeader>
							<CardContent>
								<Skeleton className="h-5 w-4/5 mb-2" />
								<Skeleton className="h-4 w-full mb-2" />
								<Skeleton className="h-4 w-11/12" />
							</CardContent>
							<CardFooter className="flex justify-between">
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-8 w-28 rounded-md" />
							</CardFooter>
						</Card>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{products?.length === 0 ? (
						<div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
							<SearchIcon className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-xl font-bold mb-2">No results</h3>
							<p className="text-muted-foreground max-w-[520px]">
								Try adjusting your keyword, category, or price range.
							</p>
							<div className="mt-6">
								<Button onClick={clearFilters} size="lg" variant="outline">
									Clear filters
								</Button>
							</div>
						</div>
					) : (
						products?.map((product, index) => (
							<Card
								key={product.id}
								className="cursor-pointer relative pt-1 interactive group opacity-0 animate-[fadeInUp_400ms_var(--ease-spring)_forwards]"
								style={{ animationDelay: `${index * 50}ms` }}
								onClick={() =>
									navigate(`/shop/item/${product.id}`, {
										state: { productData: product, productImage: products ?? [], index },
									})
								}
							>
								<div className="absolute top-0.5 right-6 flex gap-x-1">
									{product.tags?.map((tag) => (
										<Badge key={tag} variant="default" className="capitalize">
											{tag}
										</Badge>
									))}
								</div>
								<CardHeader className="p-0">
									<div className="overflow-hidden rounded-lg">
										<img
											src={product.imageUrls?.[0] ?? '/general-image.jpg'}
											alt={product.name}
											className="object-cover w-full h-48 transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.05]"
										/>
									</div>
								</CardHeader>
								<CardContent>
									<CardTitle>{product.name.toUpperCase()}</CardTitle>
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
						))
					)}
				</div>
			)}
		</main>
	);
}
