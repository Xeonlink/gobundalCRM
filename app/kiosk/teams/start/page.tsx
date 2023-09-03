"use client";

import { PageProps } from "@/extra/type";
import Image from "next/image";
import IcoLogo from "@/public/icons/logo_transparent.png";
import Link from "next/link";

export default function Page(_: PageProps) {
  return (
    <main className="flex h-full min-h-screen flex-col items-center justify-center">
      <Image
        src={IcoLogo}
        alt="gobundal-logo"
        width={250}
        height={250}
        placeholder="blur"
        className="m-auto my-8"
      />

      <Link href="./coupon" type="button" className="dsy-btn mb-14 border-none shadow-md">
        <span className="font-bold">환영합니다</span>
      </Link>
    </main>
  );
}
