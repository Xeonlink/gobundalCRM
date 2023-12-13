"use client";

import { ErrorProps } from "@/extra/type";
import "./error.css";

export default function Error(props: ErrorProps) {
  return (
    <div className="flex h-screen">
      <div className="m-auto w-[640px] max-w-full space-y-4">
        <h1 className="bg-gradient-to-b from-orange-200 to-green-200 bg-clip-text text-[10rem] font-extrabold">
          Oops!
        </h1>
        <h2 className="text-2xl font-bold">{props.error.name}</h2>
        <p className="max-w-full break-all">{props.error.message}</p>
        <button type="button" className="dsy-btn-wide dsy-btn-lg dsy-btn" onClick={props.reset}>
          되돌아가기
        </button>
      </div>
    </div>
  );
}
