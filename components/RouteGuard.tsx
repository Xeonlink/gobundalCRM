"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export function RouteGuard(props: PropsWithChildren) {
  const navigate = useRouter();
  const { isSignIn } = useAuth();

  useEffect(() => {
    if (isSignIn) return;
    navigate.push("/login");
  }, []);

  if (isSignIn) {
    return props.children;
  } else {
    return null;
  }
}
