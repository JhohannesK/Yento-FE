import { Heart, Package, Search, ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppContext } from '@/lib/appContext';
import { isAuthenticated } from '@/lib/auth';

const navLinks = [
	{ to: '/shop/search', label: 'Search', icon: Search },
	{ to: '/shop/wishlist', label: 'Wishlist', icon: Heart },
	{ to: '/shop/cart', label: 'Cart', icon: ShoppingCart },
] as const;

export function AppSidebar() {
	const navigate = useNavigate();
	const { cart } = useAppContext();
	const authenticated = isAuthenticated();

	return (
		<Sidebar collapsible="offcanvas" side="left">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link to="/shop/home" className="flex items-center gap-2">
								<Package className="size-5" />
								<span>Yeton</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Shop</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link to="/shop/home">
										<Package className="size-4" />
										Home
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{navLinks.map(({ to, label, icon: Icon }) => (
								<SidebarMenuItem key={to}>
									<SidebarMenuButton asChild>
										<Link to={to} className="flex items-center gap-2">
											<Icon className="size-4" />
											{label}
											{to === '/shop/cart' && cart && cart.length > 0 && (
												<span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
													{cart.length}
												</span>
											)}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					{authenticated ? (
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link to="/shop/order/history">
									<User className="size-4" />
									Order History
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					) : (
						<SidebarMenuItem>
							<Button
								variant="ghost"
								className="w-full justify-start gap-2"
								onClick={() => navigate('/auth?auth=signin')}
							>
								<User className="size-4" />
								Sign In
							</Button>
						</SidebarMenuItem>
					)}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
