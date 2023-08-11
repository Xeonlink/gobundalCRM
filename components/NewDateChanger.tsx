"use client";

import { cn } from "@/extra/utils";

type Props = {
  className?: string;
  date: `${string}-${string}-${string}` | string;
  onChange: (date: `${string}-${string}-${string}`) => void;
};

export function NewDateChanger(props: Props) {
  const { date, onChange, className } = props;
  const [year, month, day] = date.split("-");

  return (
    <div
      id="date"
      className={cn("dsy-join", {
        [className || ""]: !!className,
      })}
    >
      <select
        className="dsy-select-bordered dsy-select dsy-join-item dsy-select-sm"
        value={+year}
        onChange={(e) => onChange(`${e.target.value}-${month}-${day}}`)}
      >
        {[2023, 2024, 2025].map((year) => (
          <option key={year} value={year}>
            {year}년
          </option>
        ))}
      </select>
      <select
        className="dsy-select-bordered dsy-select dsy-join-item dsy-select-sm"
        value={+month}
        onChange={(e) => onChange(`${year}-${`0${e.target.value}`.slice(-2)}-${day}`)}
      >
        {new Array(12).fill(0).map((_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}월
          </option>
        ))}
      </select>
      <select
        className="dsy-select-bordered dsy-select dsy-join-item dsy-select-sm"
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
