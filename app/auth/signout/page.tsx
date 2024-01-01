"use client";

import { PageProps } from "@/extra/type";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page(props: PageProps<{}, { callbackurl: string }>) {
  const { callbackurl = "/user" } = props.searchParams;

  useEffect(() => {
    signOut({ redirect: false }); // client-side only function
    redirect(`/auth/signin?callbackurl=${callbackurl}`);
  }, []);

  return null;
}
