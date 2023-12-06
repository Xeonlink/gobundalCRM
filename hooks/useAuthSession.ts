import { useSession } from "next-auth/react";
import { redirect, usePathname, useSearchParams } from "next/navigation";

export function useAuthSession(required: boolean = false, onUnauthenticated?: () => void) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useSession({
    required,
    onUnauthenticated: () => {
      onUnauthenticated?.();
      if (required) {
        redirect(`/auth/signin?callbackUrl=${pathname}?${searchParams.toString()}`);
      }
    },
  });
}
