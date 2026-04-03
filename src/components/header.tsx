import { Heart, Package, Search, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { AccountMenu } from './account-menu';
import { SidebarTrigger } from './ui/sidebar';
import { useAppContext } from '@/lib/appContext';
import { isAuthenticated } from '@/lib/auth';

const navLinks = [
	{ to: '/shop/search', label: 'Search', icon: Search },
	{ to: '/shop/wishlist', label: 'Wishlist', icon: Heart },
	{ to: '/shop/cart', label: 'Cart', icon: ShoppingCart },
] as const;

const Header = () => {
	const { cart } = useAppContext();
	const authenticated = isAuthenticated();
	const navigate = useNavigate();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="flex items-center h-14 px-4 sm:px-6 gap-2 sm:gap-4 min-w-0">
				<SidebarTrigger
					className="-ml-1 shrink-0 lg:hidden active:scale-[0.97] transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
					aria-label="Open menu"
				/>
				<Link
					to="/shop/home"
					className="flex items-center shrink-0 gap-2 min-w-0"
				>
					<Package className="h-6 w-6 shrink-0" />
					<span className="font-bold truncate">Yeton</span>
				</Link>

				{/* Desktop / large tablet nav */}
				<nav className="hidden lg:flex items-center ml-auto gap-2 sm:gap-4 shrink-0">
					{navLinks.map(({ to, label, icon: Icon }) => (
						<Link
							key={to}
							to={to}
							className="relative p-2 text-sm font-medium rounded-md text-muted-foreground transition-[color,transform] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:text-primary active:scale-[0.97] motion-reduce:active:scale-100"
							aria-label={label}
						>
							<Icon className="h-5 w-5" />
							{to === '/shop/cart' && cart && cart.length > 0 && (
								<span
									key={cart.length}
									className="absolute -top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white animate-[badgePop_300ms_var(--ease-spring)]"
								>
									{cart.length}
								</span>
							)}
						</Link>
					))}
					{authenticated ? (
						<AccountMenu />
					) : (
						<Button
							size="sm"
							onClick={() => navigate('/auth?auth=signin')}
						>
							Sign In
						</Button>
					)}
				</nav>

				{/* Compact widths: cart shortcut; full nav lives in sheet */}
				<div className="flex items-center gap-2 ml-auto lg:hidden">
					<Link
						to="/shop/cart"
						className="relative shrink-0 rounded-md p-2 text-muted-foreground transition-[color,transform] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:text-primary active:scale-[0.97] motion-reduce:active:scale-100"
						aria-label="Cart"
					>
						<ShoppingCart className="h-5 w-5" />
						{cart && cart.length > 0 && (
							<span
								key={cart.length}
								className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white animate-[badgePop_300ms_var(--ease-spring)]"
							>
								{cart.length}
							</span>
						)}
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
