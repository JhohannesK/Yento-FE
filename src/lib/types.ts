import { z } from 'zod';
import { addNewProductFormSchema, signInSchema, signUpSchema } from './schema';

/** Matches backend ApiResponse<T> - all API responses use this shape. */
export type ApiResponse<T = unknown> = {
	status: number;
	message: string;
	data: T | null;
};

export type SignInInputs = z.infer<typeof signInSchema>

export type SignUpInputs = z.infer<typeof signUpSchema>

export type AddNewProduct = z.infer<typeof addNewProductFormSchema>

export type ProductResponseType = {
   id: number,
   name: string,
   stockQuantity: number,
   minimumStockLevel: number,
   description: string,
   price: number,
   category: string,
   imageUrls?: string[],
   tags?: string[],
   variants: {
      id: number,
      size: string,
      color: string,
      sku: string,
      priceModifier: number
   }[],
   createdAt: string,
   updatedAt: string
}

export type ICartVariant = {
	id: number;
	size: string;
	color: string;
	sku: string;
	priceModifier: number;
};

export interface ICart {
	id: number;
	name: string;
	description: string;
	price: number;
	category: string;
	quantity: number;
	tags: string[];
	/** Absent when the product has no variants (checkout sends null `productVariantId`). */
	variant: ICartVariant | null;
}

/** First catalog variant for quick-add flows, or null when the product has no variants. */
export function primaryVariantForCart(
	product: ProductResponseType,
): ICartVariant | null {
	const v = product.variants[0];
	if (!v) return null;
	return {
		id: v.id,
		size: v.size,
		color: v.color,
		sku: v.sku,
		priceModifier: v.priceModifier,
	};
}

export interface IProductVariant {
   id?: number,
   size: string,
   color: string,
   sku: string,
   priceModifier: number
}

export type AddNewProductType = {
   name: string,
   stockQuantity: number,
   minimumStockLevel: number,
   price: number,
   category: string,
   description: string,
   imageUrls?: string[],
   tags?: string[],
   variants?: IProductVariant[]
}

export type OrderPayloadType = {
	orderItems: {
		productId: number;
		productVariantId: number | null;
		quantity: number;
		unitPrice: number;
	}[];
	paymentMethod: string;
};

export type OrderHistoryTypes = {
   id: number,
   userId: string,
   orderNumber: string,
   totalAmount: number,
   paymentMethod: string,
   orderDate: string,
   status: string,
   items: {
      id: number,
      product: {
         id: number,
         name: string,
         stockQuantity: number,
         minimumStockLevel: number,
         description: string,
         price: number,
         category: string,
         tags: string[],
         variants: {
            id: number,
            size: string,
            color: string,
            sku: string,
            priceModifier: number
         }[],
         createdAt: string,
         updatedAt: string
      },
      variants: {
         id: number,
         size: string,
         color: string,
         sku: string,
         priceModifier: number
      },
      quantity: number,
      unitPrice: number
   }[]
}
