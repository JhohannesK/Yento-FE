import { DataTable } from '@/components/ui/data-table';
import useProduct from '@/lib/hooks/useProduct';
import { columns } from './columns';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AdminProducts = () => {
	const { productsByUser } = useProduct();
	return (
		<div className='container mx-auto px-4 py-8 flex-1 flex flex-col gap-y-2 lg:w-[120rem]'>
			<div className='flex items-center w-full justify-between mb-4'>
				<Link
					to='/shop/home'
					className='inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Back to Home
				</Link>
			</div>

			<div>
				<h1 className='font-bold text-2xl mb-4'>My Products</h1>
				<DataTable columns={columns} data={productsByUser ?? []} />
			</div>
		</div>
	);
};

export default AdminProducts;
