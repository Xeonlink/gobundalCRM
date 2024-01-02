import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

export const db = new PrismaClient();

export type Slug<T extends string[]> = {
  params: Record<T[number], string>;
};

export function withHost(path: string) {
  if (typeof window === "undefined") {
    return "http://" + headers().get("host") + path;
  }
  return path;
}
