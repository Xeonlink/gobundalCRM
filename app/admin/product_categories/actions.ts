"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";

export async function deleteProductCategory(id: number) {
  await db.productCategory.delete({ where: { id } });

  revalidatePath("/admin/product_categories", "page");
}

export async function getProductCategories() {
  return await db.productCategory.findMany({
    include: {
      products: true,
    },
  });
}
