import { MutateOption, QueryOptions } from "@/extra/type";
import { MutateOptions, useQuery } from "@tanstack/react-query";
import { useAutoInvalidateMutation } from "../hooks/useAutoInvalidateMutation";
import { GetResponse, apiRoot } from "./utils";

export interface ProductImage {
  id: string;
  src: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  isSale: boolean;
  salePrice: number;
  remain: number;
  enabled: boolean;
  category: string;
  images: ProductImage[];
  descriptionImage: ProductImage;
}

export const defaultProduct: RawProduct = {
  name: "",
  price: 0,
  isSale: false,
  salePrice: 0,
  remain: 0,
  enabled: false,
  category: "",
  images: [],
  descriptionImage: {
    id: "",
    src: "",
    width: 0,
    height: 0,
  },
};

export type RawProduct = Omit<Product, "id">;

export function useProducts(options?: QueryOptions<GetResponse<Product>>) {
  const queryFn = async () => {
    const uri = `/products`;
    const res = await apiRoot.get<GetResponse<Product>>(uri);
    return res.data;
  };

  return useQuery(["products"], queryFn, {
    suspense: true,
    ...options,
  });
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
  const queryFn = async () => {
    const uri = `/products/${id}`;
    const res = await apiRoot.get<Product>(uri);
    return res.data;
  };

  return useQuery(["products", id], queryFn, {
    suspense: true,
    ...options,
  });
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

export async function getPrdocutsByCategory(category: string) {
  const uri = `/products`;
  const config = { params: { category } };
  const res = await apiRoot.get<GetResponse<Product>>(uri, config);
  return res.data;
}

export function useProductsByCategory(
  category: string,
  options?: QueryOptions<GetResponse<Product>>,
) {
  const queryFn = () => getPrdocutsByCategory(category);

  return useQuery(["products", category], queryFn, {
    suspense: true,
    ...options,
  });
}
