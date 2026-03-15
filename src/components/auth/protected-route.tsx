import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';

export function ProtectedRoute() {
	const location = useLocation();
	if (!isAuthenticated()) {
		const redirect = encodeURIComponent(location.pathname + location.search);
		return <Navigate to={`/auth?auth=signin&redirect=${redirect}`} replace />;
	}
	return <Outlet />;
}
