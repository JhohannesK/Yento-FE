import { z } from 'zod';
import { addNewProductFormSchema, signInSchema, signUpSchema } from './schema';

export type SignInInputs = z.infer<typeof signInSchema>

export type SignUpInputs = z.infer<typeof signUpSchema>

export type AddNewProduct = z.infer<typeof addNewProductFormSchema>

export type ProductResponseType = {
   id: number,
   name: string,
   quantity: number,
   description: string,
   price: number,
   category: string,
   tags: string,
   variants: {
      id: number,
      variantName: string,
      variantValue: string
   }[]
}

export type AddNewProductType = {
   name: string,
   quantity: number,
   price: number,
   category: string,
   description: string,
   tags?: string,
   variants?: {
      variantName: string,
      variantValue: string
   }[]

}