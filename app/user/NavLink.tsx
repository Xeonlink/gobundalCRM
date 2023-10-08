"use client";

import { cn } from "@/extra/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";

export function NavLink(
  props: PropsWithChildren<{ href: string; exact?: boolean; check?: string }>,
) {
  const { href, exact = false, children } = props;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const path = decodeURI(pathname + "?" + searchParams);

  const candidate = props.check ?? href;
  const isMyLink = exact ? path === candidate : path.startsWith(candidate);

  return (
    <Link
      href={href}
      className={cn("hover:text-orange-400", {
        "text-orange-400": isMyLink,
      })}
    >
      {children}
    </Link>
  );
}
