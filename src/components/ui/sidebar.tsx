/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContext = {
	state: 'expanded' | 'collapsed';
	open: boolean;
	setOpen: (open: boolean) => void;
	openMobile: boolean;
	setOpenMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider');
	}
	return context;
}

const SidebarProvider = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		defaultOpen?: boolean;
	}
>(
	(
		{
			open: controlledOpen,
			onOpenChange,
			defaultOpen = true,
			className,
			style,
			children,
			...props
		},
		ref,
	) => {
		const isMobile = useIsMobile();
		const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
		const open = controlledOpen ?? uncontrolledOpen;
		const setOpen = React.useCallback(
			(value: boolean | ((v: boolean) => boolean)) => {
				const next = typeof value === 'function' ? value(open) : value;
				onOpenChange?.(next);
				setUncontrolledOpen(next);
			},
			[onOpenChange, open],
		);

		const [openMobile, setOpenMobile] = React.useState(false);

		const toggleSidebar = React.useCallback(() => {
			if (isMobile) {
				setOpenMobile((o) => !o);
			} else {
				setOpen((o) => !o);
			}
		}, [isMobile, setOpen]);

		React.useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if ((e.metaKey || e.ctrlKey) && e.key === SIDEBAR_KEYBOARD_SHORTCUT) {
					e.preventDefault();
					toggleSidebar();
				}
			};
			window.addEventListener('keydown', handleKeyDown);
			return () => window.removeEventListener('keydown', handleKeyDown);
		}, [toggleSidebar]);

		const value = React.useMemo<SidebarContext>(
			() => ({
				state: open ? 'expanded' : 'collapsed',
				open,
				setOpen,
				openMobile,
				setOpenMobile,
				isMobile,
				toggleSidebar,
			}),
			[open, setOpen, openMobile, isMobile, toggleSidebar],
		);

		return (
			<SidebarContext.Provider value={value}>
				<div
					ref={ref}
					data-sidebar="provider"
					className={cn('group/sidebar flex min-h-svh w-full', className)}
					style={
						{
							'--sidebar-width': SIDEBAR_WIDTH,
							'--sidebar-width-mobile': SIDEBAR_WIDTH_MOBILE,
							...style,
						} as React.CSSProperties
					}
					{...props}
				>
					{children}
				</div>
			</SidebarContext.Provider>
		);
	},
);
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & {
		side?: 'left' | 'right';
		variant?: 'sidebar' | 'floating' | 'inset';
		collapsible?: 'offcanvas' | 'icon' | 'none';
	}
>(
	(
		{
			side = 'left',
			variant = 'sidebar',
			collapsible = 'offcanvas',
			className,
			children,
			...props
		},
		ref,
	) => {
		const { isMobile, openMobile, setOpenMobile } = useSidebar();

		// Sidebar only on mobile (Sheet). On desktop we use the navbar only.
		if (!isMobile) {
			return null;
		}

		return (
			<Sheet
				open={openMobile}
				onOpenChange={setOpenMobile}
			>
				<SheetContent
					side={side}
					className="w-[var(--sidebar-width-mobile)] p-0 gap-0"
					showCloseButton={false}
				>
					<div
						data-sidebar="sidebar"
						className={cn("flex h-full w-full flex-col bg-sidebar", className)}
						ref={ref}
						{...props}
					>
						{children}
					</div>
				</SheetContent>
			</Sheet>
		);
	},
);
Sidebar.displayName = 'Sidebar';

const SidebarHeader = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="sidebar-header"
		className={cn('flex flex-col gap-2 p-2', className)}
		{...props}
	/>
));
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="sidebar-footer"
		className={cn('flex flex-col gap-2 p-2 mt-auto', className)}
		{...props}
	/>
));
SidebarFooter.displayName = 'SidebarFooter';

const SidebarContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="sidebar-content"
		className={cn(
			'flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2',
			className,
		)}
		{...props}
	/>
));
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="sidebar-group"
		className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
		{...props}
	/>
));
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
	const Comp = asChild ? Slot : 'div';
	return (
		<Comp
			ref={ref}
			data-sidebar="sidebar-group-label"
			className={cn(
				'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70',
				className,
			)}
			{...props}
		/>
	);
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="sidebar-group-content"
		className={cn(
			'relative flex w-full min-w-0 flex-1 flex-col gap-1',
			className,
		)}
		{...props}
	/>
));
SidebarGroupContent.displayName = 'SidebarGroupContent';

const SidebarMenu = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
	<ul
		ref={ref}
		data-sidebar="sidebar-menu"
		className={cn('flex w-full min-w-0 flex-col gap-1', className)}
		{...props}
	/>
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
	<li
		ref={ref}
		data-sidebar="sidebar-menu-item"
		className={cn('group/menu-item relative', className)}
		{...props}
	/>
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const SidebarMenuButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<'button'> & {
		asChild?: boolean;
		isActive?: boolean;
		tooltip?: string | React.ReactNode;
	}
>(({ asChild, isActive, className, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			ref={ref}
			data-sidebar="sidebar-menu-button"
			data-active={isActive}
			className={cn(
				'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
				isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
				className,
			)}
			{...props}
		/>
	);
});
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarTrigger = React.forwardRef<
	React.ElementRef<typeof Button>,
	React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return (
		<Button
			ref={ref}
			variant="ghost"
			size="icon"
			className={cn(className)}
			onClick={toggleSidebar}
			{...props}
		>
			<Menu className="size-5" strokeWidth={2} />
			<span className="sr-only">Open menu</span>
		</Button>
	);
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarInset = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
	<main
		ref={ref}
		className={cn(
			'relative flex min-h-svh flex-1 flex-col bg-background min-w-0',
			className,
		)}
		{...props}
	/>
));
SidebarInset.displayName = 'SidebarInset';

export {
	SidebarProvider,
	Sidebar,
	SidebarHeader,
	SidebarFooter,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarTrigger,
	SidebarInset,
	useSidebar,
	SIDEBAR_WIDTH,
	SIDEBAR_WIDTH_MOBILE,
};
