"use client";

import { ErrorProps } from "@/extra/type";

export default function Error(props: ErrorProps) {
  return (
    <main className="min-h-screen">
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{props.error.name}</h1>
        <p className="text-xl">{props.error.message}</p>
      </div>
    </main>
  );
}
