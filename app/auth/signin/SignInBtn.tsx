"use client";

import { signIn } from "next-auth/react";
import { ComponentProps } from "react";

type Props = {
  provider: "naver" | "kakao" | "google";
  callbackurl?: string;
} & ComponentProps<"button">;

export function SignInBtn(props: Props) {
  return (
    <button
      {...props}
      type="button"
      onClick={() => {
        signIn(props.provider, { callbackUrl: props.callbackurl });
      }}
    >
      {props.children}
    </button>
  );
}
