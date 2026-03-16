import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../api/axios"
import type { AddNewProductType, ApiResponse, ProductResponseType } from "../types"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { createProduct, updateProduct } from "../api/product"

const useProduct = () => {
   const navigate = useNavigate()
   const queryClient = useQueryClient()
   const { mutateAsync: addNewProduct, isPending: isProductAdditionPending, isSuccess: isProductAdditionSuccess } = useMutation({
      mutationFn: async (product: AddNewProductType) => {
         const response = await createProduct(product)
         return response
      },
      onSuccess: () => {
         toast.success('Product was added successfully')
         queryClient.invalidateQueries({
            queryKey: ['get-all-products', 'productImages']
         })
         navigate('/shop/home')
      },
      onError: (err: { response?: { data?: { message?: string } } }) => {
         toast.error(err.response?.data?.message ?? "Error while adding product.")
      }
   })

   const { mutateAsync: editProduct, isPending: isProductEditingPending, isSuccess: isProductEditingSuccess } = useMutation({
      mutationFn: async ({ product, productId }: { product: AddNewProductType, productId: number }) => {
         const response = await updateProduct(productId.toString(), product)
         return response
      },
      onSuccess: () => {
         toast.success('Product was updated successfully')
         queryClient.invalidateQueries({
            queryKey: ['get-all-products', 'productImages']
         })
         navigate('/shop/home')
      },
      onError: (err: { response?: { data?: { message?: string } } }) => {
         toast.error(err.response?.data?.message ?? "Error while updating product.")
      }
   })

   const { data: categories } = useQuery({
      queryKey: ['get-all-categories'],
      queryFn: async () => {
         const res = await axiosInstance.get<ApiResponse<{ id: number; name: string }[]>>(
            'products/category/get-all-categories'
         )
         return res.data.data ?? []
      }
   })

   const { data: productsByUser } = useQuery({
      queryKey: ['get-all-products-user'],
      queryFn: async () => {
         const res = await axiosInstance.get<ApiResponse<ProductResponseType[]>>(
            'products/get-all-products-by-user'
         )
         return res.data.data ?? []
      }
   })
   return {
      addNewProduct,
      productsByUser,
      isProductAdditionPending,
      isProductAdditionSuccess,
      categories,
      editProduct,
      isProductEditingPending,
      isProductEditingSuccess
   }
}

export default useProduct

