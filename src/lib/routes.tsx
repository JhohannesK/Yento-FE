import ErrorPage from '@/components/error-page';
import AuthenticationPage from '@/pages/auth/Authentication';
import AdminNewItem from '@/pages/shop/AdminAddItemPage';
import Home from '@/pages/shop/Home';
import HomeLayout from '@/pages/shop/Layout';
import ProductDetails from '@/pages/shop/view/Product-Items';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <AuthenticationPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/shop',
		element: <HomeLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: 'home',
				element: <Home />,
				// loader: teamLoader,
			},
			{
				path: 'item/:id',
				element: <ProductDetails />,
				// loader: teamLoader,
			},
			{
				path: 'admin/home',
				element: <AdminNewItem />,
				// loader: teamLoader,
			},
		],
	},
]);
