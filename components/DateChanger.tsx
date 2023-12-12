"use client";

import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { ComponentProps } from "react";

export function DateChanger(props: ComponentProps<"input">) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.replace(`?date=${e.target.value}`);
  };

  return (
    <input
      {...props}
      type="date"
      value={searchParams.get("date") ?? dayjs().format("YYYY-MM-DD")}
      onChange={onDateChange}
      max={dayjs().format("YYYY-MM-DD")}
      className="dsy-input dsy-input-sm"
    />
  );
}
