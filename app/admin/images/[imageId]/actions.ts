"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateImage(id: number, formData: FormData) {
  const _ = await db.image.update({
    where: { id },
    data: {
      name: String(formData.get("name")),
      description: String(formData.get("description")),
      mimeType: String(formData.get("mimeType")),
      size: Number(formData.get("size")),
      width: Number(formData.get("width")),
      height: Number(formData.get("height")),
      src: String(formData.get("src")),
    },
  });

  revalidatePath("/admin/images", "page");
  redirect("/admin/images");
}

export async function deleteImage(id: number) {
  const _ = await db.image.delete({ where: { id } });

  revalidatePath("/admin/images", "page");
  redirect("/admin/images");
}
