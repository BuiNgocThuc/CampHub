// src/libs/hooks/useItemMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem, updateItem, deleteItem } from "@/libs/api/item-api";
import { Item } from "@/libs/core/types";

export const useCreateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createItem,
        onSuccess: (newItem) => {
            queryClient.setQueryData(["myItems"], (old: Item[] = []) => [...old, newItem]);
            queryClient.invalidateQueries({ queryKey: ["myItems"] });
        },
    });
};

export const useUpdateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateItem,
        onSuccess: (updatedItem) => {
            queryClient.setQueryData(["myItems"], (old: Item[] = []) =>
                old.map((i) => (i.id === updatedItem.id ? updatedItem : i))
            );
        },
    });
};

export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteItem,
        onSuccess: (_, id) => {
            queryClient.setQueryData(["myItems"], (old: Item[] = []) => old.filter((i) => i.id !== id));
        },
    });
};