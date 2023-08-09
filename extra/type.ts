import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

export type EmptyObject<T = any> = {
  [key: string]: T;
};

export interface PageProps<P = {}, S = {}> {
  params: P;
  searchParams: S;
}

export interface LayoutParam<P = {}> {
  children?: React.ReactNode;
  params?: PageProps<P>;
}

export type ModalProps<T = {}> = T & {
  closeSelf?: () => void;
  ref?: (instance: HTMLDialogElement) => void;
};

export type PropsWithClassName<T = {}> = T & {
  className?: string;
};

export type QueryOptions<T> = Omit<
  UseQueryOptions<T, unknown, T, string[]>,
  "queryKey" | "queryFn" | "initialData"
>;

export type MutateOption = Omit<
  UseMutationOptions<any, unknown, void, unknown>,
  "mutationFn" | "mutationKey"
>;

export type GenericMutateOption<TVariables> = Omit<
  UseMutationOptions<any, unknown, TVariables, unknown>,
  "mutateFn" | "mutationKey"
>;
