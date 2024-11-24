import { formatDate, formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import useOrder from '@/lib/hooks/useOrder';
import { OrderHistoryTypes } from '@/lib/types';

export interface Order {
	id: string;
	date: Date;
	status: string;
	total: number;
	items?: OrderItem[];
	shippingAddress?: string;
	paymentMethod?: string;
}
export interface OrderItem {
	id: string;
	name: string;
	quantity: number;
	price: number;
}

export default function OrderList() {
	// const orders = getOrders();
	const navigate = useNavigate();
	const { getUserOrderHistory } = useOrder();
	console.log(
		'🚀 ~ OrderList ~ getUserOrderHistory:',
		getUserOrderHistory.data
	);
	const orders = getUserOrderHistory.data?.data;

	const handleNavigation = (orderId: number, order: OrderHistoryTypes) => {
		navigate(`/shop/order/${orderId}`, {
			state: { order },
		});
	};

	return (
		<div className='flex flex-col gap-y-3'>
			{orders?.map((order) => (
				<Card
					onClick={() => handleNavigation(order.id, order)}
					key={order.id}
					className='hover:shadow-md transition-shadow'
				>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Order #{order.orderNumber}
						</CardTitle>
						<Badge
							variant={
								order.status === 'Delivered' ? 'default' : 'secondary'
							}
						>
							{order.status}
						</Badge>
					</CardHeader>
					<CardContent>
						<div className='flex justify-between text-sm'>
							<span className='text-muted-foreground'>
								{formatDate(new Date(order.orderDate))}
							</span>
							<span className='font-semibold'>
								{formatCurrency(order.totalAmount)}
							</span>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
