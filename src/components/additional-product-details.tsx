import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { ProductResponseType } from '@/lib/types';

const AdditionalProductDetails = ({
	product,
}: {
	product: ProductResponseType;
}) => {
	return (
		<Tabs
			defaultValue="description"
			className="mt-12"
		>
			<TabsList className="space-x-2">
				<TabsTrigger value="description">Description</TabsTrigger>
				<TabsTrigger value="specifications">Specifications</TabsTrigger>
				<TabsTrigger value="reviews">Reviews</TabsTrigger>
			</TabsList>
			<TabsContent
				value="description"
				className="mt-4"
			>
				<Card>
					<CardContent className="pt-6 prose max-w-none">
						<h3 className="font-bold capitalize">
							{product.name ?? 'Premium Wireless Headphones'}
						</h3>
						{product.description}
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent
				value="specifications"
				className="mt-4"
			>
				<Card>
					<CardContent className="pt-6">
						<table className="w-full">
							<tbody>
								<tr className="border-b">
									<td className="py-2 font-medium">Driver Size</td>
									<td className="py-2">40mm</td>
								</tr>
								<tr className="border-b">
									<td className="py-2 font-medium">Frequency Response</td>
									<td className="py-2">20Hz - 20kHz</td>
								</tr>
								<tr className="border-b">
									<td className="py-2 font-medium">Impedance</td>
									<td className="py-2">32 Ohm</td>
								</tr>
								<tr className="border-b">
									<td className="py-2 font-medium">Battery Life</td>
									<td className="py-2">Up to 30 hours</td>
								</tr>
								<tr className="border-b">
									<td className="py-2 font-medium">Charging Time</td>
									<td className="py-2">2 hours</td>
								</tr>
								<tr>
									<td className="py-2 font-medium">Weight</td>
									<td className="py-2">250g</td>
								</tr>
							</tbody>
						</table>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent
				value="reviews"
				className="mt-4"
			>
				<Card>
					<CardContent className="pt-6">
						<div className="space-y-4">
							{[1, 2, 3].map((review) => (
								<div
									key={review}
									className="pb-4 border-b last:border-b-0"
								>
									<div className="flex items-center justify-between mb-2">
										<div className="font-semibold">John Doe</div>
										<div className="flex">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className="w-4 h-4 fill-primary text-primary"
												/>
											))}
										</div>
									</div>
									<p className="text-sm text-muted-foreground">
										These headphones are amazing! The sound quality is superb,
										and the noise-cancellation works like a charm. I use them
										every day for work and leisure.
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
};

export default AdditionalProductDetails;
