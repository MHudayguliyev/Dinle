"use client";
import {
    QueryClient,
    QueryClientProvider,
} from "react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, 
            refetchOnWindowFocus: false
        }
    }
});

const Provider = ({ children }: {children: React.ReactNode}) => {
return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)
}

export default Provider
  
