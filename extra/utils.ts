import { EmptyObject } from "./type";

export function toHyphenPhone(str: string): string {
  return str
    .match(/\d*/g)
    ?.join("")
    .match(/(\d{0,3})(\d{0,4})(\d{0,4})/)
    ?.slice(1)
    .join("-")
    .replace(/-*$/g, "")!;
}
export const serializeSearchParams = <T extends EmptyObject>(searchParams: T) => {
  return (
    "?" +
    Object.entries(searchParams)
      .map((entry) => entry.join("="))
      .join("&")
  );
};

export const cls = (className: string, optoinalClasses?: { [key: string]: boolean }) => {
  return (
    className +
    " " +
    (optoinalClasses
      ? Object.entries(optoinalClasses)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(" ")
      : "")
  );
};

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
