import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export type Slug<T extends string[]> = {
  params: Record<T[number], string>;
};
