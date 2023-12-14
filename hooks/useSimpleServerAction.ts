import { useTransition } from "react";

export function useSimpleServerAction(action: (formData: FormData) => any) {
  const [isPending, startTransition] = useTransition();

  const runAction = async (formData: FormData) => {
    startTransition(() => {
      action(formData);
    });
  };

  return [isPending, runAction] as const;
}
