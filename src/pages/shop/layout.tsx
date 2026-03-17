import Footer from '@/components/footer';
import Header from '@/components/header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppProvider } from '@/lib/appContext';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
	return (
		<AppProvider>
			<SidebarProvider defaultOpen={true}>
				<AppSidebar />
				<SidebarInset>
					<Header />
					<div className="flex-1 w-full">
						<Outlet />
					</div>
					<Footer />
				</SidebarInset>
			</SidebarProvider>
		</AppProvider>
	);
};

export default HomeLayout;
