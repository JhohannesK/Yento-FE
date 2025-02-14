import { useMutation, useQueryClient } from "@tanstack/react-query"
import { OrderPayloadType } from "../types"
import { axiosInstance } from "../api/axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../appContext"

const useOrder = () => {
   const queryClient = useQueryClient()
   const navigate = useNavigate()
   const { setAddToCart } = useAppContext()

   const makeOrderMutation = useMutation({
      mutationFn: async (product: OrderPayloadType) => {
         const response = await axiosInstance.post('order', product)
         return response.data
      },
      onSuccess: () => {
         toast.success('Order was successful')
         setAddToCart([])
         queryClient.invalidateQueries({
            queryKey: ['get-all-products', 'productImages', 'get-user-order-history']
         })
         navigate('/shop/home')
      },
      onError: () => {
         toast.error("Error while making order.")
      }
   })

   const cancelOrderMutation = useMutation({
      mutationFn: async (orderId: number) => {
         const response = await axiosInstance.post(`order/${orderId}/cancel-order`)
         return response.data
      },
      onSuccess: () => {
         toast.success('Order was cancelled')
         queryClient.invalidateQueries({
            queryKey: ['get-user-order-history']
         })
         navigate('/shop/order/history')
      },
      onError: () => {
         toast.error("Error while cancelling order.")
      }
   })


   return {
      makeOrderMutation,
      cancelOrderMutation
   }
}

export default useOrder
