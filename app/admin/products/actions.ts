"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: number) {
  await db.product.delete({ where: { id } });

  revalidatePath("/admin/products", "page");
}

export async function getNotAssignedImages() {
  return await db.image.findMany();
}

export async function getProducts() {
  return await db.product.findMany({
    include: {
      category: true,
      images: true,
    },
  });
}
