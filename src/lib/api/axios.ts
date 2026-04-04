import axios from 'axios';
import {
	clearSession,
	getAccessToken,
	getRefreshToken,
	setSessionTokens,
} from '../auth/session';

const baseURL = import.meta.env.VITE_DEV_URL || 'http://localhost:3000/api';

/** Paths where 401 must not trigger refresh (avoids infinite loop on failed refresh; wrong credentials). */
function isAuthPathThatSkipsRefresh(url: string | undefined): boolean {
	if (!url) return false;
	return (
		url.includes('/auth/refresh') ||
		url.includes('/auth/signin') ||
		url.includes('/auth/signup')
	);
}

export const axiosInstance = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
	const path = config.url ?? '';
	// Never send Bearer on refresh — expired JWT would fail JwtBearer before the controller runs.
	const omitBearer =
		path.includes('/auth/refresh') ||
		path.includes('/auth/signin') ||
		path.includes('/auth/signup') ||
		path.includes('/auth/signout');
	if (!omitBearer) {
		const token = getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

/** One shared refresh: backend revokes the old refresh token on success. */
let refreshInFlight: Promise<void> | null = null;

function refreshSessionOnce(): Promise<void> {
	if (refreshInFlight) return refreshInFlight;

	const rt = getRefreshToken();
	if (!rt) {
		return Promise.reject(new Error('No refresh token'));
	}

	refreshInFlight = axiosInstance
		.post('/auth/refresh', { refreshToken: rt })
		.then((res) => {
			const d = (res.data as { data?: { accessToken?: string; refreshToken?: string } })
				?.data;
			if (d?.accessToken && d?.refreshToken) {
				setSessionTokens(d.accessToken, d.refreshToken);
			}
		})
		.finally(() => {
			refreshInFlight = null;
		});
	return refreshInFlight;
}

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config as { _retry?: boolean } | undefined;
		const shouldTryRefresh =
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			!isAuthPathThatSkipsRefresh(error.config?.url);

		if (shouldTryRefresh) {
			originalRequest._retry = true;
			try {
				await refreshSessionOnce();
				return axiosInstance(error.config!);
			} catch {
				clearSession();
				localStorage.removeItem('user');
				const redirect = encodeURIComponent(
					window.location.pathname + window.location.search,
				);
				window.location.href = `/auth?auth=signin&redirect=${redirect}`;
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	},
);
