import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SignInInputs, SignUpInputs } from "../types";
import { axiosInstance } from "../api/axios";
import { toast } from "sonner";
import { saveToLocalStorage } from "../utils";

export const useAuth = () => {
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();

   const signIn = useMutation({
      mutationFn: async (data: SignInInputs) => {
         const req = axiosInstance.post("/auth/signin", data);
         const response = await req;
         toast.promise(req, {
            success: "Login Successful",
            error: (err: { response?: { data?: { message?: string } } }) =>
               err.response?.data?.message ?? "Something occurred",
            loading: "loading...",
         });
         return (response.data as { data: { user: unknown } }).data;
      },
      onSuccess: (data) => {
         saveToLocalStorage({ key: "user", state: data.user });
         queryClient.setQueryData(["user"], data.user);
         const redirect = searchParams.get("redirect");
         const target = redirect ? decodeURIComponent(redirect) : "/shop/home";
         navigate(target.startsWith("/") ? target : `/${target}`, { replace: true });
      },
      onError: (error: Error & { response?: { data?: { message?: string } } }) => {
         toast.error(error.response?.data?.message ?? "Something occurred");
      },
   });

   const signUp = useMutation({
      mutationFn: async (data: SignUpInputs) => {
         const req = axiosInstance.post("/auth/signup", data);
         const response = await req;
         toast.promise(req, {
            success: "Signup Successful",
            error: (err: { response?: { data?: { message?: string } } }) =>
               err.response?.data?.message ?? "Something occurred",
            loading: "loading...",
         });
         return response.data;
      },
      onSuccess: () => {
         navigate("/auth?auth=signin");
      },
   });

   const signOut = useMutation({
      mutationFn: async () => {
         await axiosInstance.post("/auth/signout");
      },
      onSettled: () => {
         localStorage.removeItem("user");
         queryClient.clear();
         navigate("/auth?auth=signin");
      },
   });


   return {
      signIn,
      signUp,
      signOut,
   };
};