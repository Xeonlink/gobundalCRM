import { PageProps } from "@/extra/type";
import IconNaverLogin from "@/public/icons/naver_login.png";
import IconKakaoLogin from "@/public/icons/kakao_login.png";
import IconGoogleLogin from "@/public/icons/google_login.png";
import Image from "next/image";
import { SignInBtn } from "./SignInBtn";

export default function Page(props: PageProps<any, { callbackurl: string }>) {
  const { callbackurl = "/user" } = props.searchParams;

  return (
    <ul className="m-auto max-w-xs space-y-2 rounded-lg bg-white bg-opacity-60 p-6">
      <li>
        <SignInBtn provider="naver" callbackurl={callbackurl}>
          <Image src={IconNaverLogin} alt="네이버로그인" placeholder="blur" priority />
        </SignInBtn>
      </li>
      <li>
        <SignInBtn provider="kakao" callbackurl={callbackurl}>
          <Image src={IconKakaoLogin} alt="카카오로그인" placeholder="blur" priority />
        </SignInBtn>
      </li>
      <li>
        <SignInBtn provider="google" callbackurl={callbackurl}>
          <Image src={IconGoogleLogin} alt="구글로그인" placeholder="blur" priority />
        </SignInBtn>
      </li>
    </ul>
  );
}
