import { formatDate, formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { OrderHistoryTypes } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useOrder from '@/lib/hooks/useOrder';

export default function OrderDetails() {
	const { order } = useLocation().state as {
		order: OrderHistoryTypes;
	};
	const navigate = useNavigate();
	const { cancelOrderMutation } = useOrder();

	if (!order) {
		navigate('/order/error');
	}

	return (
		<div className='container mx-auto px-4 py-8 flex-1 flex flex-col gap-y-2 lg:w-[120rem]'>
			<div className='flex items-center w-full justify-between mb-4'>
				<Link
					to='/shop/order/history'
					className='inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Back to Order History
				</Link>
				{order.status === 'Pending' && (
					<Button
						variant={'destructive'}
						onClick={() => cancelOrderMutation.mutate(order.id)}
					>
						Cancel order
					</Button>
				)}
			</div>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0'>
					<CardTitle>Order #{order.orderNumber}</CardTitle>
					<Badge
						variant={
							order.status === 'Delivered' ? 'default' : 'secondary'
						}
					>
						{order.status}
					</Badge>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Date Placed
							</p>
							<p>{formatDate(new Date(order.orderDate))}</p>
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Total Amount
							</p>
							<p className='font-semibold'>
								{formatCurrency(order.totalAmount)}
							</p>
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Shipping Address
							</p>
							<p>Accra, Ghana</p>
						</div>
						<div>
							<p className='text-sm font-medium text-muted-foreground'>
								Payment Method
							</p>
							<p>{order.paymentMethod}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Order Items</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Product</TableHead>
								<TableHead className='text-right'>Quantity</TableHead>
								<TableHead className='text-right'>Price</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{order.items?.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.product.name}</TableCell>
									<TableCell className='text-right'>
										{item.quantity}
									</TableCell>
									<TableCell className='text-right'>
										{formatCurrency(item.unitPrice)}
									</TableCell>
								</TableRow>
							))}
							<TableRow>
								<TableCell colSpan={2} className='font-semibold'>
									Total
								</TableCell>
								<TableCell className='text-right font-semibold'>
									{formatCurrency(order.totalAmount)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
