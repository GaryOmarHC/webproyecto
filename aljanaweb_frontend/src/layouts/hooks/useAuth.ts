import { useQuery } from "@tanstack/react-query";
import { gerUser } from "@/api/AuthAPI";

export const useAuth =() =>{
    const {data, isError, isLoading} = useQuery({
        queryKey: ['user'],
        queryFn: gerUser,
        retry:1,
        refetchOnWindowFocus: false
    })
    
    return{ data, isError, isLoading}
}