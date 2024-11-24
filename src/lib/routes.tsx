import ErrorPage from '@/components/error-page';
import AuthenticationPage from '@/pages/auth/Authentication';
import AdminNewItem from '@/pages/shop/AdminAddItemPage';
import CheckoutPage from '@/pages/shop/CheckOut';
import Home from '@/pages/shop/Home';
import HomeLayout from '@/pages/shop/Layout';
import OrderDetails from '@/pages/shop/order/order-details';
import OrderHistory from '@/pages/shop/order/order-history';
import OrderLayout from '@/pages/shop/order/OrderLayout';
import ProductDetails from '@/pages/shop/view/Product-Items';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <AuthenticationPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/auth',
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
				path: 'cart',
				element: <CheckoutPage />,
				// loader: teamLoader,
			},
			{
				path: 'admin/home',
				element: <AdminNewItem />,
				// loader: teamLoader,
			},
			{
				path: 'order',
				element: <OrderLayout />,
				// loader: teamLoader,
				children: [
					{
						path: 'history',
						element: <OrderHistory />,
					},
					{
						path: ':id',
						element: <OrderDetails />,
					},
				],
			},
		],
	},
]);
