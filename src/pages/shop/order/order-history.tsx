import OrderList from '@/components/order-list';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
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
							<span>Pending</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span>Delivered</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<span>Cancelled</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<OrderList />
		</div>
	);
};

export default OrderHistory;
