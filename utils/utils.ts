export function toHyphenPhone(str: string): string {
  return str
    .match(/\d*/g)
    ?.join("")
    .match(/(\d{0,3})(\d{0,4})(\d{0,4})/)
    ?.slice(1)
    .join("-")
    .replace(/-*$/g, "")!;
}

export const cloneDeep = <T extends object>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};
