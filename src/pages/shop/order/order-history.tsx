import OrderList from '@/components/order-list';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { axiosInstance } from '@/lib/api/axios';
import { OrderHistoryTypes } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Filter } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

enum OrderStatus {
	All = 'All',
	Pending = 'Pending',
	Shipped = 'Shipped',
	Delivered = 'Delivered',
	Cancelled = 'Cancelled',
}

const OrderHistory = () => {
	const [filter, setFilter] = useState<OrderStatus>(OrderStatus.All);

	const { data } = useQuery({
		queryKey: ['get-user-order-history', filter],
		queryFn: async () => {
			const response = await axiosInstance.get<{
				status: number;
				message: string;
				data: OrderHistoryTypes[];
			}>(`order/user-orders?status=${filter}`);
			return response.data.data;
		},
	});
	return (
		<div className='container mx-auto px-4 py-8 flex-1 lg:w-[120rem]'>
			<div className='flex items-center justify-between mb-4'>
				<Link
					to='/shop/home'
					className='inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Back to Home
				</Link>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant={'secondary'}>
							<Filter />
							<span>Filter by</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-28'>
						<DropdownMenuItem>
							<span onClick={() => setFilter(OrderStatus.All)}>
								Clear Filters
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span onClick={() => setFilter(OrderStatus.Pending)}>
								Pending
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span onClick={() => setFilter(OrderStatus.Delivered)}>
								Delivered
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span onClick={() => setFilter(OrderStatus.Cancelled)}>
								Cancelled
							</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<OrderList orders={data ?? []} />
		</div>
	);
};

export default OrderHistory;
