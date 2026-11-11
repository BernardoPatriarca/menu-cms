import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProductService } from "../services/product.service"
import type { UpdateProductDTO } from "../dtos/product.dto"

export const productsKey = ["products"] as const

export function useProducts() {
  return useQuery({
    queryKey: productsKey,
    queryFn: ProductService.list,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ProductService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productsKey }),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDTO }) =>
      ProductService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productsKey }),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ProductService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productsKey }),
  })
}
