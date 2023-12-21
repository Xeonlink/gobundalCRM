"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const _ = await db.product.create({
    data: {
      enabled: Boolean(formData.get("enabled")),
      isSale: Boolean(formData.get("isSale")),
      isRemainInfinite: Boolean(formData.get("isRemainInfinite")),
      name: String(formData.get("name")),
      categoryId: Number(formData.get("category")),
      images: {
        connect: (formData.getAll("imageIds") as string[]).map((id) => ({
          id: Number(id),
        })),
      },
      price: Number((formData.get("price") as string).replaceAll(",", "")),
      salePrice: Number((formData.get("salePrice") as string).replaceAll(",", "")),
      remain: Number((formData.get("remain") as string).replaceAll(",", "")),
      isRecommended: Boolean(formData.get("isRecommended")),
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products", RedirectType.replace);
}

export async function getProductCategories() {
  return await db.productCategory.findMany();
}
