import type { AddNewProductType, ApiResponse, ProductResponseType } from "../types";
import { axiosInstance } from "./axios";

const productsBase = "/products";

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const getProducts = async (category?: string) => {
	const url =
		category && category !== "All"
			? `${productsBase}/get-all-products?category=${encodeURIComponent(category)}`
			: `${productsBase}/get-all-products`;
	const response = await axiosInstance.get<ApiResponse<ProductResponseType[]>>(url);
	return unwrap(response) ?? [];
};

export const getProductById = async (id: string) => {
	const response = await axiosInstance.get<ApiResponse<ProductResponseType>>(
		`${productsBase}/get-product-by-id/${id}`
	);
	return unwrap(response);
};

export const createProduct = async (product: AddNewProductType) => {
	const response = await axiosInstance.post<ApiResponse<ProductResponseType>>(
		`${productsBase}/create-product`,
		product
	);
	return unwrap(response);
};

export const updateProduct = async (id: string, product: AddNewProductType) => {
	const response = await axiosInstance.put<ApiResponse<ProductResponseType>>(
		`${productsBase}/update/${id}`,
		product
	);
	return unwrap(response);
};

export const deleteProduct = async (id: string) => {
	const response = await axiosInstance.delete<ApiResponse<null>>(
		`${productsBase}/delete/${id}`
	);
	return unwrap(response);
};

export const getProductCategories = async () => {
	const response = await axiosInstance.get<ApiResponse<{ id: number; name: string }[]>>(
		`${productsBase}/category/get-all-categories`
	);
	return unwrap(response) ?? [];
};

export const getProductTags = async () => {
	const response = await axiosInstance.get<ApiResponse<{ id: number; name: string }[]>>(
		`${productsBase}/tag/get-all-tags`
	);
	return unwrap(response) ?? [];
};

export type SearchParams = {
	q?: string;
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	sort?: "price_asc" | "price_desc";
};

export const searchProducts = async (params: SearchParams) => {
	const sp = new URLSearchParams();
	if (params.q) sp.set("q", params.q);
	if (params.category) sp.set("category", params.category);
	if (params.minPrice != null) sp.set("minPrice", String(params.minPrice));
	if (params.maxPrice != null) sp.set("maxPrice", String(params.maxPrice));
	if (params.sort) sp.set("sort", params.sort);
	const response = await axiosInstance.get<ApiResponse<ProductResponseType[]>>(
		`${productsBase}/search?${sp.toString()}`
	);
	return unwrap(response) ?? [];
};