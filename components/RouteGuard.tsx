"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export function RouteGuard(props: PropsWithChildren) {
  const navigate = useRouter();
  const path = usePathname();
  const { isSignIn } = useAuth();

  useEffect(() => {
    if (!isSignIn) {
      navigate.push(`/login?url=${path}`);
    }
  }, []);

  return props.children;
}
