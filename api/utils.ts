import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { QueryFunction, QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";

export const apiRoot = (() => {
  const apiBase = axios.create({
    baseURL: "https://ntm02yf619.execute-api.ap-northeast-2.amazonaws.com/prod",
  });

  // apiBase.interceptors.request.use(async (config) => {
  //   const token = await getIdToken();
  //   config.headers.Authorization = token;
  //   return config;
  // });

  return apiBase;
})();

export type GetResponse<T> = {
  data: T[];
};

export const useQueryFactory =
  <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  ) =>
  <SelectType = TData>(
    options?: Omit<
      UseQueryOptions<TQueryFnData, TError, SelectType, TQueryKey>,
      "queryKey" | "queryFn"
    >,
  ) => {
    return useQuery(queryKey, queryFn, options);
  };
