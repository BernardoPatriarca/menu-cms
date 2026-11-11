import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CategoryService } from "../services/category.service"
import type { UpdateCategoryDTO } from "../dtos/category.dto"

export const categoriesKey = ["categories"] as const

export function useCategories() {
  return useQuery({
    queryKey: categoriesKey,
    queryFn: CategoryService.list,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CategoryService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoriesKey }),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDTO }) =>
      CategoryService.update(id, dto),
    onSuccess: () => {
      // O nome da categoria também aparece na listagem de produtos.
      void queryClient.invalidateQueries({ queryKey: ["products"] })
      return queryClient.invalidateQueries({ queryKey: categoriesKey })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CategoryService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoriesKey }),
  })
}
