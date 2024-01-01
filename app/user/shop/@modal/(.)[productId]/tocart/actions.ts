"use server";

import { db } from "@/app/api/utils";

export async function getProduct(id: number) {
  return await db.product.findFirstOrThrow({
    where: {
      id,
    },
  });
}
