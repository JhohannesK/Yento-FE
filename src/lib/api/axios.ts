import axios from "axios";

const baseURL = import.meta.env.VITE_DEV_URL || "http://localhost:3000/api";

/** Paths where 401 must not trigger refresh (avoids infinite loop on failed refresh; wrong credentials). */
function isAuthPathThatSkipsRefresh(url: string | undefined): boolean {
	if (!url) return false;
	return (
		url.includes("/auth/refresh") ||
		url.includes("/auth/signin") ||
		url.includes("/auth/signup")
	);
}

export const axiosInstance = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const shouldTryRefresh =
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			!isAuthPathThatSkipsRefresh(originalRequest.url);

		if (shouldTryRefresh) {
			originalRequest._retry = true;
			try {
				await axiosInstance.post("/auth/refresh");
				return axiosInstance(originalRequest);
			} catch {
				localStorage.removeItem("user");
				const redirect = encodeURIComponent(
					window.location.pathname + window.location.search
				);
				window.location.href = `/auth?auth=signin&redirect=${redirect}`;
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	}
);
