import type { ApiResponse, ProductResponseType } from "../types";
import { axiosInstance } from "./axios";

const base = "/wishlist";

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const getWishlist = async (): Promise<ProductResponseType[]> => {
	const response = await axiosInstance.get<ApiResponse<ProductResponseType[]>>(base);
	return unwrap(response) ?? [];
};

export const getWishlistIds = async (): Promise<number[]> => {
	const response = await axiosInstance.get<ApiResponse<number[]>>(`${base}/ids`);
	return unwrap(response) ?? [];
};

export const addToWishlist = async (productId: number): Promise<void> => {
	await axiosInstance.post(`${base}/${productId}`);
};

export const removeFromWishlist = async (productId: number): Promise<void> => {
	await axiosInstance.delete(`${base}/${productId}`);
};
