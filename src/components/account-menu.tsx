import {
	Apple,
	Cloud,
	CreditCard,
	History,
	LifeBuoy,
	LogOut,
	Settings,
	User,
} from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { cn, loadFromLocalStorage } from '@/lib/utils';

type AccountMenuProps = {
	/** Icon-only trigger (toolbar / mobile header) */
	compact?: boolean;
	/** Where the menu anchors relative to the trigger */
	align?: 'start' | 'center' | 'end';
};

export function AccountMenu({ compact = false, align = 'end' }: AccountMenuProps) {
	const { signOut } = useAuth();
	const navigate = useNavigate();
	const user = loadFromLocalStorage({ key: 'user' });
	const userObj =
		user && user !== false && typeof user === 'object'
			? (user as { role?: string })
			: null;
	const showShortcuts = !compact;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant={compact ? 'ghost' : 'outline'}
					size={compact ? 'icon' : 'default'}
					className={cn(
						compact &&
							'shrink-0 text-muted-foreground hover:text-primary active:scale-[0.97] transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
					)}
					aria-label="Account menu"
				>
					<User className="h-5 w-5" />
					{!compact ? <span className="sr-only">Account</span> : null}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={align}
				sideOffset={compact ? 8 : 4}
				className="z-[100] w-[min(calc(100vw-2rem),14rem)] max-h-[min(70vh,24rem)] overflow-y-auto"
			>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<User />
						<span>Profile</span>
						{showShortcuts ? (
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						) : null}
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCard />
						<span>Billing</span>
						{showShortcuts ? (
							<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
						) : null}
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Settings />
						<span>Settings</span>
						{showShortcuts ? (
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						) : null}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => navigate('/shop/order/history')}
					>
						<History />
						<span>Order History</span>
						{showShortcuts ? (
							<DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
						) : null}
					</DropdownMenuItem>
					{userObj?.role === 'Admin' ? (
						<DropdownMenuItem
							onClick={() => navigate('/shop/admin/my-products')}
						>
							<Apple />
							<span>My Products</span>
						</DropdownMenuItem>
					) : null}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<LifeBuoy />
					<span>Support</span>
				</DropdownMenuItem>
				<DropdownMenuItem disabled>
					<Cloud />
					<span>API</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-destructive focus:text-destructive"
					onClick={() => signOut.mutate()}
				>
					<LogOut />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
