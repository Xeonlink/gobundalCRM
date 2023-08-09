import { MutateOption } from "@/extra/type";
import {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export function useAutoInvalidateMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationKey" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>(mutationKey, mutationFn, {
    ...options,
    onSuccess: (data: TData, variables: TVariables, context?: TContext) => {
      queryClient.invalidateQueries(mutationKey);
      options?.onSuccess?.(data, variables, context);
    },
  });
}
