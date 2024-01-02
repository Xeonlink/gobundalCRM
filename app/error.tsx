"use client";

import { ErrorProps } from "@/extra/type";
import "./error.css";
import { useRouter } from "next/router";

export default function Error(props: ErrorProps) {
  const router = useRouter();

  return (
    <div className="flex h-screen">
      <div className="m-auto w-[640px] max-w-full space-y-4">
        <h1 className="bg-gradient-to-b from-orange-200 to-green-200 bg-clip-text text-[10rem] font-extrabold">
          Oops!
        </h1>
        <h2 className="text-2xl font-bold">{props.error.name}</h2>
        <p className="max-w-full break-all">{props.error.message}</p>
        <div>
          <button type="button" className="dsy-btn dsy-btn-wide dsy-btn-lg" onClick={props.reset}>
            재시도하기
          </button>
          <button type="button" className="dsy-btn dsy-btn-wide dsy-btn-lg" onClick={router.back}>
            이전으로
          </button>
        </div>
      </div>
    </div>
  );
}
