"use server";

import { db } from "@/app/api/utils";

export async function getProductCategories() {
  return await db.productCategory.findMany({
    where: {
      enabled: true,
    },
  });
}

export async function getProductsByCategory(categoryId?: number) {
  return await db.product.findMany({
    where: {
      categoryId,
      enabled: true,
    },
    include: {
      images: true,
    },
  });
}
