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
