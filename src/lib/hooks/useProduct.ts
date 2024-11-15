import { useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../api/axios"
import { AddNewProductType } from "../types"

const useProduct = () => {
   const { mutateAsync: addNewProduct, isPending: isProductAdditionPending, isSuccess: isProductAdditionSuccess } = useMutation({
      mutationFn: async (product: AddNewProductType) => {
         const response = await axiosInstance.post('products/create', product)
         return response.data
      }
   })
   return { addNewProduct, isProductAdditionPending, isProductAdditionSuccess }
}

export default useProduct

