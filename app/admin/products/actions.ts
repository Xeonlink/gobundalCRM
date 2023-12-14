"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: number) {
  await db.product.delete({ where: { id } });

  revalidatePath("/admin/products", "page");
}
