import { MutateOption, QueryOptions } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useAutoInvalidateMutation } from "../hooks/useAutoInvalidateMutation";
import { GetResponse, apiRoot } from "./utils";

export const defaultCustomer: RawCustomer = {
  name: "",
  phone: "",
  address: "",
  addressDetail: "",
};

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
}

export type RawCustomer = Omit<Customer, "id">;

export function useCustomers(options?: QueryOptions<GetResponse<Customer>>) {
  const queryFn = async () => {
    const uri = `/customers`;
    const res = await apiRoot.get<GetResponse<Customer>>(uri);
    return res.data;
  };

  return useQuery(["customers"], queryFn, {
    suspense: true,
    ...options,
  });
}

export function useCustomersByName(name: string, options?: QueryOptions<GetResponse<Customer>>) {
  const queryFn = async () => {
    const uri = `/customers`;
    const config = { params: { name } };
    const res = await apiRoot.get<GetResponse<Customer>>(uri, config);
    return res.data;
  };

  return useQuery(["customers", JSON.stringify({ name })], queryFn, {
    ...options,
  });
}

export function useCustomersByPhone(phone: string, options?: QueryOptions<GetResponse<Customer>>) {
  const queryFn = async () => {
    const uri = `/customers`;
    const config = { params: { phone } };
    const res = await apiRoot.get<GetResponse<Customer>>(uri, config);
    return res.data;
  };

  return useQuery(["customers", JSON.stringify({ phone })], queryFn, {
    suspense: true,
    ...options,
  });
}

export function useCreateCustomer(rawCustomer: RawCustomer, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/customers`;
    const body = rawCustomer;
    const res = await apiRoot.post(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["customers"], mutationFn, options);
}

export function useUpdateCustomer(
  id: string,
  partialCustomer: Partial<Customer>,
  options?: MutateOption,
) {
  const mutationFn = async () => {
    const uri = `/customers/${id}`;
    const body = partialCustomer;
    const res = await apiRoot.patch(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["customers"], mutationFn, options);
}

export function useDeleteCustomer(id: string, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/customers/${id}`;
    const res = await apiRoot.delete(uri);
    return res.data;
  };

  return useAutoInvalidateMutation(["customers"], mutationFn, options);
}

export function useCustomer(id: string, options?: QueryOptions<Customer>) {
  const auth = useAuth();

  const queryFn = async () => {
    const uri = `/customers/${id}`;
    const res = await apiRoot.get<Customer>(uri);
    return res.data;
  };

  return useQuery(["customers", id], queryFn, {
    suspense: true,
    enabled: auth.isSignIn,
    ...options,
  });
}

export function useDeleteCustomers(ids: string[], options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/customers`;
    const config = { params: { ids: JSON.stringify(ids) } };
    const res = await apiRoot.delete(uri, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["customers"], mutationFn, options);
}
