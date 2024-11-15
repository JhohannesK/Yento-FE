import axios from "axios";

const baseURL = import.meta.env.VITE_DEV_URL || "http://localhost:3000/api";
const unsplashURL = import.meta.env.VITE_UNSPLASH_URL || 'http://localhost:300/api'
const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

export const axiosInstance = axios.create({
   baseURL,
   headers: {
      "Content-Type": "application/json",
   },
});
export const unsplashAxiosInstance = axios.create({
   baseURL: unsplashURL,
   headers: {
      "Content-Type": "application/json",
   },
});


axiosInstance.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

unsplashAxiosInstance.interceptors.request.use(
   (config) => {
      if (accessKey) {
         config.headers.Authorization = `Bearer Client-ID ${accessKey}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;
         try {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await axiosInstance.post("/auth/refresh", { refreshToken });
            const { token } = response.data;
            localStorage.setItem("token", token);
            return axiosInstance(originalRequest);
         } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/auth?auth=signin";
            return Promise.reject(error);
         }
      }
      return Promise.reject(error);
   }
);

unsplashAxiosInstance.interceptors.response.use((response) => response,
   async (error) => {
      return Promise.reject(error);
   }
)