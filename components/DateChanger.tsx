"use client";

import { cn } from "@/extra/utils";

type Props = {
  className?: string;
  date: `${string}-${string}-${string}` | string;
  onChange: (date: `${string}-${string}-${string}`) => void;
};

export function DateChanger(props: Props) {
  const { date, onChange, className } = props;
  const [year, month, day] = date.split("-");

  return (
    <div
      id="date"
      className={cn("flex items-center rounded-md bg-white", {
        [className || ""]: !!className,
      })}
    >
      <select
        className="btn w-full appearance-none px-3 py-2 shadow-none"
        value={+year}
        onChange={(e) => onChange(`${e.target.value}-${month}-${day}}`)}
      >
        {[2023, 2024, 2025].map((year) => (
          <option key={year} value={year}>
            {year}년
          </option>
        ))}
      </select>
      <span className="text-gray-200">|</span>
      <select
        className="btn w-full appearance-none px-3 py-2 shadow-none"
        value={+month}
        onChange={(e) => onChange(`${year}-${`0${e.target.value}`.slice(-2)}-${day}`)}
      >
        {new Array(12).fill(0).map((_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}월
          </option>
        ))}
      </select>
      <span className="text-gray-200">|</span>
      <select
        className="btn w-full appearance-none px-3 py-2 shadow-none"
        value={+day}
        onChange={(e) => onChange(`${year}-${month}-${`0${e.target.value}`.slice(-2)}`)}
      >
        {new Array(31).fill(0).map((_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}일
          </option>
        ))}
      </select>
    </div>
  );
}
