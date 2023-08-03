import { MutateOption } from "@/extra/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAutoInvalidateMutation(
  mutationKey: string[],
  mutationFn: () => Promise<any>,
  options?: MutateOption,
) {
  const queryClient = useQueryClient();

  return useMutation<any, unknown, void, unknown>(mutationKey, mutationFn, {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(mutationKey);
      options?.onSuccess?.(data, variables, context);
    },
  });
}
