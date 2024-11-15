import { Heart, Menu, Package, Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { AccountMenu } from './account-menu';

const Header = () => {
	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex items-center h-14'>
				<Link to='/shop/home' className='flex items-center space-x-2'>
					<Package className='w-6 h-6' />
					<span className='font-bold'>Yeton</span>
				</Link>
				<nav className='flex items-center ml-auto space-x-4'>
					<Link
						to='/search'
						className='text-sm font-medium transition-colors hover:text-primary'
					>
						<Search className='w-5 h-5' />
						<span className='sr-only'>Search</span>
					</Link>

					<Link
						to='/wishlist'
						className='text-sm font-medium transition-colors hover:text-primary'
					>
						<Heart className='w-5 h-5' />
						<span className='sr-only'>Wishlist</span>
					</Link>
					<Link
						to='/cart'
						className='text-sm font-medium transition-colors hover:text-primary'
					>
						<ShoppingCart className='w-5 h-5' />
						<span className='sr-only'>Cart</span>
					</Link>
					<AccountMenu />
					<Button variant='outline' size='icon' className='md:hidden'>
						<Menu className='w-5 h-5' />
						<span className='sr-only'>Toggle menu</span>
					</Button>
				</nav>
			</div>
		</header>
	);
};

export default Header;
