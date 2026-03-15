import ErrorPage from '@/components/error-page';
import { ProtectedRoute } from '@/components/auth/protected-route';
import AuthenticationPage from '@/pages/auth/Authentication';
import AdminProducts from '@/pages/shop/admin/admin-products';
import AdminNewItem from '@/pages/shop/admin/admin-add-item-page';
import CheckoutPage from '@/pages/shop/check-out';
import HomeLayout from '@/pages/shop/layout';
import OrderDetails from '@/pages/shop/order/order-details';
import OrderHistory from '@/pages/shop/order/order-history';
import OrderLayout from '@/pages/shop/order/OrderLayout';
import ProductDetails from '@/pages/shop/view/Product-Items';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '@/pages/shop/home';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to="/shop/home" replace />,
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
			},
			{
				path: 'item/:id',
				element: <ProductDetails />,
			},
			{
				path: 'cart',
				element: <ProtectedRoute />,
				children: [
					{
						index: true,
						element: <CheckoutPage />,
					},
				],
			},
			{
				path: 'admin',
				element: <ProtectedRoute />,
				children: [
					{
						path: 'home',
						element: <AdminNewItem />,
					},
					{
						path: 'my-products',
						element: <AdminProducts />,
					},
				],
			},
			{
				path: 'order',
				element: <ProtectedRoute />,
				children: [
					{
						element: <OrderLayout />,
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
		],
	},
]);
