import { MutateOption, QueryOptions } from "@/extra/type";
import { useAutoInvalidateMutation } from "@/hooks/useAutoInvalidateMutation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetResponse, apiRoot } from "./utils";

export interface Asset {
  id: string;
  name: string;
  mimeType: string;
  src: string;
  refCount: number;
}

export type RawAsset = Omit<Asset, "id" | "refCount" | "src">;

export function useAssets(options?: QueryOptions<GetResponse<Asset>>) {
  const queryFn = async () => {
    const uri = `/assets`;
    const res = await apiRoot.get<GetResponse<Asset>>(uri);
    return res.data;
  };

  return useQuery(["assets"], queryFn, {
    suspense: true,
    ...options,
  });
}

export function useAsset(id: string, options?: QueryOptions<Asset>) {
  const queryFn = async () => {
    const uri = `/assets/${id}`;
    const res = await apiRoot.get<Asset>(uri);
    return res.data;
  };

  return useQuery(["assets", id], queryFn, {
    suspense: true,
    ...options,
  });
}

export function useCreateAsset(file: File, rawAsset: RawAsset, options?: MutateOption) {
  const mutationFn = async () => {
    const config = { params: { mimeType: rawAsset.mimeType } };
    const { data: signedUrl } = await apiRoot.get<string>("/assets/signedUrl", config);
    const { protocol, hostname, pathname } = new URL(signedUrl);
    const src = await axios.put(signedUrl, file).then(() => `${protocol}//${hostname}${pathname}`);
    const asset: Omit<Asset, "id"> = { ...rawAsset, refCount: 0, src };
    const res = await apiRoot.post("/assets", asset);
    return res.data;
  };

  return useAutoInvalidateMutation(["assets"], mutationFn, options);
}

export function useUpdateAsset(id: string, asset: Partial<Asset>, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/assets/${id}`;
    const res = await apiRoot.patch(uri, asset);
    return res.data;
  };

  return useAutoInvalidateMutation(["assets"], mutationFn, options);
}

export function useDeleteAsset(id: string, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/assets/${id}`;
    const res = await apiRoot.delete(uri);
    return res.data;
  };

  return useAutoInvalidateMutation(["assets"], mutationFn, options);
}
