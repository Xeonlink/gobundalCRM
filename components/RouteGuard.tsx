"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export function RouteGuard(props: PropsWithChildren) {
  const navigate = useRouter();
  const { isSignIn } = useAuth();

  if (!isSignIn) {
    navigate.replace("/login");
    return <div></div>;
  }

  return props.children;
}
