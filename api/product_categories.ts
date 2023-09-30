import { MutateOption, QueryOptions } from "@/extra/type";
import { MutateOptions, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { useAutoInvalidateMutation } from "../hooks/useAutoInvalidateMutation";
import { GetResponse, apiRoot } from "./utils";

export interface ProductCategory {
  id: string;
  name: string;
  enabled: boolean;
}

export type RawProduct = Omit<ProductCategory, "id">;

const base_uri = "/product_categories";

export function useProductCategories(options?: QueryOptions<GetResponse<ProductCategory>>) {
  const queryFn = async () => {
    const uri = base_uri;
    const res = await apiRoot.get<GetResponse<ProductCategory>>(uri);
    return res.data;
  };

  return useQuery(["product_categories"], queryFn, {
    suspense: true,
    ...options,
  });
}

export function useCreateProductCategory(item: RawProduct, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = base_uri;
    const body = item;
    const res = await apiRoot.post(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["product_categories"], mutationFn, options);
}

export function useUpdateProductCategory(
  id?: string,
  item?: Partial<ProductCategory>,
  options?: Omit<
    UseMutationOptions<any, unknown, { id: string; item: Partial<ProductCategory> }, unknown>,
    "mutationFn" | "mutationKey"
  >,
) {
  const mutationFn = async (variables: { id: string; item: Partial<ProductCategory> }) => {
    if (!id && !variables.id) throw new Error("id is null");
    if (!item && !variables.item) throw new Error("item is null");

    const uri = `${base_uri}/${variables.id || id}`;
    const body = variables.item || item;
    const res = await apiRoot.patch(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["product_categories"], mutationFn, options);
}

export function useDeleteProductCategory(
  id?: string | null | undefined,
  options?: Omit<UseMutationOptions<any, unknown, string, unknown>, "mutationFn" | "mutationKey">,
) {
  const mutationFn = async (variables: string) => {
    if (!id && !variables) throw new Error("id is null");
    const uri = `${base_uri}/${variables || id}`;
    const res = await apiRoot.delete(uri);
    return res.data;
  };

  return useAutoInvalidateMutation(["product_categories"], mutationFn, options);
}

export function useProductCategory(id: string, options?: QueryOptions<ProductCategory>) {
  const queryFn = async () => {
    const uri = `${base_uri}/${id}`;
    const res = await apiRoot.get<ProductCategory>(uri);
    return res.data;
  };

  return useQuery(["product_categories", id], queryFn, {
    suspense: true,
    ...options,
  });
}

export function useDeleteProductCategories(ids: string[], options?: MutateOption) {
  const mutationFn = async () => {
    const uri = base_uri;
    const config = { params: { ids: JSON.stringify(ids) } };
    const res = await apiRoot.delete(uri, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["product_categories"], mutationFn, options);
}
