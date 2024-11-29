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
import { loadFromLocalStorage } from '@/lib/utils';

export function AccountMenu() {
	const { signOut } = useAuth();
	const navigate = useNavigate();
	const user = loadFromLocalStorage({ key: 'user' });
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={'outline'}>
					<User className='w-5 h-5' />
					<span className='sr-only'>Account</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<User />
						<span>Profile</span>
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCard />
						<span>Billing</span>
						<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Settings />
						<span>Settings</span>
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => navigate('/shop/order/history')}
					>
						<History />
						<span>Order History</span>
						<DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
					</DropdownMenuItem>
					{user.role == 'Admin' && (
						<DropdownMenuItem
							onClick={() => navigate('/shop/admin/my-products')}
						>
							<Apple />
							<span>My Products</span>
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />

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
				<DropdownMenuItem onClick={() => signOut.mutate()}>
					<LogOut />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
