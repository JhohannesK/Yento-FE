import {
	Apple,
	Heart,
	LogOut,
	Package,
	Search,
	ShoppingCart,
	User,
	X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
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
	useSidebar,
} from '@/components/ui/sidebar';
import { useAppContext } from '@/lib/appContext';
import { isAuthenticated } from '@/lib/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { loadFromLocalStorage } from '@/lib/utils';

const navLinks = [
	{ to: '/shop/search', label: 'Search', icon: Search },
	{ to: '/shop/wishlist', label: 'Wishlist', icon: Heart },
	{ to: '/shop/cart', label: 'Cart', icon: ShoppingCart },
] as const;

export function AppSidebar() {
	const navigate = useNavigate();
	const { cart } = useAppContext();
	const authenticated = isAuthenticated();
	const { setOpenMobile } = useSidebar();
	const { signOut } = useAuth();
	const user = loadFromLocalStorage({ key: 'user' });
	const userObj =
		user && user !== false && typeof user === 'object'
			? (user as { role?: string })
			: null;

	const closeMobile = () => setOpenMobile(false);

	return (
		<Sidebar collapsible="offcanvas" side="left">
			<SidebarHeader className="border-b border-sidebar-border px-4 py-3">
				<div className="flex items-center justify-between gap-3">
					<SheetClose asChild>
						<Link
							to="/shop/home"
							className="flex min-w-0 items-center gap-2 font-semibold tracking-tight outline-none ring-sidebar-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar rounded-md"
						>
							<Package className="size-5 shrink-0" />
							<span className="truncate">Yeton</span>
						</Link>
					</SheetClose>
					<SheetClose asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="shrink-0 active:scale-[0.97] transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
							aria-label="Close menu"
						>
							<X className="size-4" />
						</Button>
					</SheetClose>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Shop</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link to="/shop/home" onClick={closeMobile}>
										<Package className="size-4" />
										Home
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{navLinks.map(({ to, label, icon: Icon }) => (
								<SidebarMenuItem key={to}>
									<SidebarMenuButton asChild>
										<Link
											to={to}
											className="flex items-center gap-2"
											onClick={closeMobile}
										>
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
						[
							<SidebarMenuItem key="orders">
								<SidebarMenuButton asChild>
									<Link to="/shop/order/history" onClick={closeMobile}>
										<User className="size-4" />
										Order History
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>,
							userObj?.role === 'Admin' ? (
								<SidebarMenuItem key="admin-products">
									<SidebarMenuButton asChild>
										<Link
											to="/shop/admin/my-products"
											onClick={closeMobile}
										>
											<Apple className="size-4" />
											My Products
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							) : null,
							<SidebarMenuItem key="logout">
								<SidebarMenuButton
									className="text-destructive hover:text-destructive hover:bg-destructive/10"
									onClick={() => {
										closeMobile();
										signOut.mutate();
									}}
								>
									<LogOut className="size-4" />
									Log out
								</SidebarMenuButton>
							</SidebarMenuItem>,
						]
					) : (
						<SidebarMenuItem>
							<Button
								variant="ghost"
								className="w-full justify-start gap-2"
								onClick={() => {
									closeMobile();
									navigate('/auth?auth=signin');
								}}
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
