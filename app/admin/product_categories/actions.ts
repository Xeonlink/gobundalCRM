"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function deleteProductCategory(id: number) {
  await db.productCategory.delete({ where: { id } });

  revalidatePath("/admin/product_categories", "page");
}
