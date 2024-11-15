import {
	Cloud,
	CreditCard,
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

export function AccountMenu() {
	const { signOut } = useAuth();
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
