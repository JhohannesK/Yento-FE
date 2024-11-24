import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../api/axios"
import { AddNewProductType } from "../types"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const useProduct = () => {
   const navigate = useNavigate()
   const queryClient = useQueryClient()
   const { mutateAsync: addNewProduct, isPending: isProductAdditionPending, isSuccess: isProductAdditionSuccess } = useMutation({
      mutationFn: async (product: AddNewProductType) => {
         const response = await axiosInstance.post('products/create', product)
         return response.data
      },
      onSuccess: () => {
         toast.success('Product was added successfully')
         queryClient.invalidateQueries({
            queryKey: ['get-all-products', 'productImages']
         })
         navigate('/shop/home')
      },
      onError: () => {
         toast.error("Error while adding product.")
      }
   })

   const { mutateAsync: editProduct, isPending: isProductEditingPending, isSuccess: isProductEditingSuccess } = useMutation({
      mutationFn: async ({ product, productId }: { product: AddNewProductType, productId: number }) => {
         const response = await axiosInstance.put(`products/update/${productId}`, product)
         return response.data
      },
      onSuccess: () => {
         toast.success('Product was updated successfully')
         queryClient.invalidateQueries({
            queryKey: ['get-all-products', 'productImages']
         })
         navigate('/shop/home')
      },
      onError: () => {
         toast.error("Error while updating product.")
      }
   })

   const { data: categories } = useQuery({
      queryKey: ['get-all-categories'],
      queryFn: async () => {
         const res = await axiosInstance.get<{ id: number, name: string }[]>('products/category/get-all-categories')
         return res.data
      }
   })
   return {
      addNewProduct,
      isProductAdditionPending,
      isProductAdditionSuccess,
      categories,
      editProduct,
      isProductEditingPending,
      isProductEditingSuccess
   }
}

export default useProduct

