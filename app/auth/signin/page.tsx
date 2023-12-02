"use client";

import { PageProps } from "@/extra/type";
import IconNaverLogin from "@/public/icons/naver_login.png";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Page(props: PageProps<any, { callbackUrl: string }>) {
  const { callbackUrl = "/user" } = props.searchParams;

  const onSignInClick = (provider: "naver") => () => {
    signIn(provider, { callbackUrl });
  };

  return (
    <ul className="m-auto max-w-xs rounded-lg bg-white bg-opacity-60 p-6 backdrop-blur-md">
      <li className="text-center">
        <button onClick={onSignInClick("naver")}>
          <Image src={IconNaverLogin} alt="네이버로그인" placeholder="blur" className="m-auto" />
        </button>
      </li>
    </ul>
  );
}
