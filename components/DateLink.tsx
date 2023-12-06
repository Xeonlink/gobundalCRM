"use client";

import { usePathname, useRouter } from "next/navigation";
import { ComponentPropsWithoutRef } from "react";
import { Input } from "./Input";

export function DateLink(props: ComponentPropsWithoutRef<"input">) {
  const { onChange, type, ...rest } = props;
  const pathname = usePathname();
  const router = useRouter();

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.replace(pathname + "?date=" + e.target.value);
  };

  return <Input type="date" onChange={onDateChange} {...rest} />;
}
