import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

export type EmptyObject<T = any> = {
  [key: string]: T;
};

export interface PageProps<P = {}, S = {}> {
  params: P;
  searchParams: S;
}

export interface ErrorProps {
  error: Error;
  reset: () => void;
}

export type LayoutParam<P = {}, L = {}> = {
  children?: React.ReactNode;
  params?: PageProps<P>;
} & L;

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
