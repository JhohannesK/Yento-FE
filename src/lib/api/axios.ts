import axios from "axios";

const baseURL = import.meta.env.VITE_DEV_URL || "http://localhost:3000/api";

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
		if (error.response?.status === 401 && !originalRequest._retry) {
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
