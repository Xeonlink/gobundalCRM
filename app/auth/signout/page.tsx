"use client";

import { PageProps } from "@/extra/type";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page(props: PageProps<{}, { callbackUrl: string }>) {
  const { callbackUrl = "/user" } = props.searchParams;

  const router = useRouter();

  useEffect(() => {
    signOut({ callbackUrl, redirect: false });
    router.replace(`/auth/signin?callbackUrl=${callbackUrl}`);
  }, []);

  return null;
}
