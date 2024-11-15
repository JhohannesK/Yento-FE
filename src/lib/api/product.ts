import { unsplashAxiosInstance } from "./axios";

export const getUnsplashImage = async (query: string, collections?: string): Promise<string> => {
   const response = await unsplashAxiosInstance.get(`/search/photos`, {
      params: {
         query,
         per_page: 1,
         collections
      },
   });
   return response.data.results[0]?.urls.regular;
};
