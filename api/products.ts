import {
  MutateOptions,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { GetResponse, apiRoot } from "./utils/utils";
import { MutateOption, QueryOptions } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useAutoInvalidateMutation } from "./utils/useAutoInvalidateMutation";

export interface Product {
  id: string;
  enabled: boolean;
  name: string;
  price: number;
  isSale: boolean;
  salePrice: number;
  remain: number;
}

export type RawProduct = Omit<Product, "id">;

export function useProducts(options?: QueryOptions<GetResponse<Product>>) {
  const auth = useAuth();

  return useQuery(
    ["products"],
    async () => {
      const uri = `/products`;
      const res = await apiRoot.get<GetResponse<Product>>(uri);
      return res.data;
    },
    {
      suspense: true,
      enabled: auth.isSignIn,
      ...options,
    }
  );
}

export function useCreateProduct(product: RawProduct, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/products`;
    const body = product;
    const res = await apiRoot.post(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["products"], mutationFn, options);
}

export function useUpdateProduct(id: string, product: Partial<Product>, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/products/${id}`;
    const body = product;
    const res = await apiRoot.patch(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["products"], mutationFn, options);
}

export function useDeleteProduct(id: string, options?: MutateOptions) {
  const mutationFn = async () => {
    const uri = `/products/${id}`;
    const res = await apiRoot.delete(uri);
    return res.data;
  };

  return useAutoInvalidateMutation(["products"], mutationFn, options);
}

export function useProduct(id: string, options?: QueryOptions<Product>) {
  const auth = useAuth();

  return useQuery(
    ["products", id],
    async () => {
      const uri = `/products/${id}`;
      const res = await apiRoot.get<Product>(uri);
      return res.data;
    },
    {
      suspense: true,
      enabled: auth.isSignIn,
      ...options,
    }
  );
}

export function useDeleteProducts(ids: string[], options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/products`;
    const config = { params: { ids: JSON.stringify(ids) } };
    const res = await apiRoot.delete(uri, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["products"], mutationFn, options);
}
