import Footer from '@/components/footer';
import Header from '@/components/header';
import { AppProvider } from '@/lib/appContext';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
	return (
		<div className='flex flex-col min-w-full min-h-screen mx-auto'>
			<AppProvider>
				<Header />
				<div className='flex-1 w-full'>
					<Outlet />
				</div>
				<Footer />
			</AppProvider>
		</div>
	);
};

export default HomeLayout;
