"use client";

import { cn } from "@/extra/utils";
import Link, { LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";

export function NavLink(props: PropsWithChildren<LinkProps & { check?: string }>) {
  const { href, children, check } = props;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const path = decodeURI(pathname + "?" + searchParams);

  const isMyLink = path.includes(check ?? href.toString());

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
