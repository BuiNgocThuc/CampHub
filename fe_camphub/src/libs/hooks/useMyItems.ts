// src/libs/hooks/useMyItems.ts
import { useQuery } from "@tanstack/react-query";
import { getMyItems } from "@/libs/api/item-api";

export const useMyItems = () => {
    return useQuery({
        queryKey: ["myItems"],
        queryFn: () => getMyItems(), // gọi API không filter
        staleTime: 1000 * 30,        // 30 giây
        gcTime: 1000 * 60 * 10,      // giữ cache 10 phút
        refetchOnWindowFocus: false,
        retry: 1,
    });
};