"use client";

import { PageProps } from "@/extra/type";
import IconNaverLogin from "@/public/icons/naver_login.png";
import IconKakaoLogin from "@/public/icons/kakao_login.png";
import IconGoogleLogin from "@/public/icons/google_login.png";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Page(props: PageProps<any, { callbackUrl: string }>) {
  const { callbackUrl = "/user" } = props.searchParams;

  const onSignInClick = (provider: "naver" | "kakao" | "google") => () => {
    signIn(provider, { callbackUrl });
  };

  return (
    <ul className="m-auto max-w-xs space-y-2 rounded-lg bg-white bg-opacity-60 p-6 backdrop-blur-md">
      <li className="text-center">
        <button onClick={onSignInClick("naver")}>
          <Image src={IconNaverLogin} alt="네이버로그인" placeholder="blur" className="m-auto" />
        </button>
      </li>
      <li className="text-center">
        <button onClick={onSignInClick("kakao")}>
          <Image src={IconKakaoLogin} alt="카카오로그인" placeholder="blur" className="m-auto" />
        </button>
      </li>
      <li className="text-center">
        <button onClick={onSignInClick("google")} className="rounded-md border">
          <Image src={IconGoogleLogin} alt="구글로그인" placeholder="blur" className="m-auto" />
        </button>
      </li>
    </ul>
  );
}
