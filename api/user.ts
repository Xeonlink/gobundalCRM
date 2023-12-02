import { MutateOption, QueryOptions } from "@/extra/type";
import { useAutoInvalidateMutation } from "@/hooks/useAutoInvalidateMutation";
import { useQuery } from "@tanstack/react-query";
import { apiRoot } from "./utils";

export const defaultUser: RawUser = {
  name: "",
  nickname: "",
  birthday: "",
  phone: "",
  address: "",
  addressDetail: "",
};

export interface User {
  id: string;
  name: string;
  nickname: string;
  birthday: string;
  phone: string;
  address: string;
  addressDetail: string;
}

export type RawUser = Omit<User, "id">;

export function useUser(id: string, options?: QueryOptions<User>) {
  const queryFn = async () => {
    const uri = `/users/${id}`;
    const res = await apiRoot.get<User>(uri);
    return res.data;
  };

  return useQuery(["users", id], queryFn, {
    suspense: true,
    ...options,
  });
}

export function useCreateUser(user: User, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/users`;
    const body = user;
    const res = await apiRoot.post(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["users"], mutationFn, options);
}

export function useUpdatUser(
  id: string,
  partialRawUser: Partial<Omit<User, "id">>,
  options?: MutateOption,
) {
  const mutationFn = async () => {
    const uri = `/users/${id}`;
    const body = partialRawUser;
    const res = await apiRoot.patch(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["users"], mutationFn, options);
}

export function useDeleteUser(id: string, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/users/${id}`;
    const res = await apiRoot.delete(uri);
    return res.data;
  };

  return useAutoInvalidateMutation(["users"], mutationFn, options);
}
