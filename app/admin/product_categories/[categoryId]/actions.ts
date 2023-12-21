"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

export const updateProductCategory = async (id: number, formData: FormData) => {
  const _ = await db.productCategory.update({
    where: {
      id,
    },
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      enabled: !!formData.get("enabled"),
    },
  });

  revalidatePath("/admin/product_categories", "page");
  redirect("/admin/product_categories", RedirectType.replace);
};
