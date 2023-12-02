"use client";

import { Pool } from "@/api/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type AuthOptions = {
  unAuthorizedRedirect?: boolean;
};

export function useAuth(
  options: AuthOptions = {
    unAuthorizedRedirect: true,
  },
) {
  const path = usePathname();
  const navigate = useRouter();
  const user = Pool.getCurrentUser();
  const isSignIn = user !== null;

  useEffect(() => {
    if (options.unAuthorizedRedirect === false) return;
    if (isSignIn === true) return;
    navigate.push(`/auth/signin?url=${path}`);
  }, []);

  return {
    user,
    isSignIn: user !== null,
  };
}
