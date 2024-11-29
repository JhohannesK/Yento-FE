import { z } from 'zod';
import { addNewProductFormSchema, signInSchema, signUpSchema } from './schema';

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

export interface ICart {
   id: number,
   name: string,
   description: string,
   price: number,
   category: string,
   quantity: number,
   tags: string[],
   variant: {
      id: number,
      size: string,
      color: string,
      sku: string,
      priceModifier: number
   },
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
   tags?: string[],
   variants?: IProductVariant[]
}

export type OrderPayloadType = {
   orderItems: {
      productId: number,
      productVariantId: number,
      quantity: number,
      unitPrice: number
   }[],
   paymentMethod: string
}

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
