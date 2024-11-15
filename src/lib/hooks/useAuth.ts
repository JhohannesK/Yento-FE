import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SignInInputs, SignUpInputs } from "../types";
import { axiosInstance } from "../api/axios";
import { toast } from "sonner";
import { saveToLocalStorage } from "../utils";

export const useAuth = () => {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const signIn = useMutation({
      mutationFn: async (data: SignInInputs) => {
         const req = axiosInstance.post("/auth/signin", data);
         const response = await req
         toast.promise(req, {
            success: 'Login Successful',
            error: (err) => `${err.response?.data || 'Something occurred'}`,
            loading: 'loading...'
         })
         return response.data;
      },
      onSuccess: (data) => {
         localStorage.setItem("token", data.token);
         saveToLocalStorage({ key: 'user', state: data.user })
         // localStorage.setItem("refreshToken", data.refreshToken);
         queryClient.setQueryData(["user"], data.user);
         navigate("/shop/home");
      },
      onError: (error: Error & { response: { data: string } }) => {
         console.log("🚀 ~ useAuth ~ error:", error)
         toast.error(error.response.data)
      }
   });

   const signUp = useMutation({
      mutationFn: async (data: SignUpInputs) => {
         const req = axiosInstance.post("/auth/signup", data);
         const response = await req
         toast.promise(req, {
            success: 'Signup Successful',
            error: (err) => `${err.response?.data || 'Something occurred'}`,
            loading: 'loading...'
         })
         return response.data;
      },
      onSuccess: (data) => {
         localStorage.setItem("token", data.token);
         // localStorage.setItem("refreshToken", data.refreshToken);
         queryClient.setQueryData(["user"], data.user);
         navigate("/?auth=signin");
      },
   });

   const signOut = useMutation({
      mutationFn: async () => {
         const response = await axiosInstance.post("/auth/signout");
         return response.data;
      },
      onSettled: () => navigate("/?auth=signin"),
      onSuccess: () => {
         localStorage.removeItem("token");
         // localStorage.removeItem("refreshToken");
         queryClient.clear();
         navigate("?auth=signin");
      },
   });


   return {
      signIn,
      signUp,
      signOut,
   };
};