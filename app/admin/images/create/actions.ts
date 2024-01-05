"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createImage(formData: FormData) {
  const _ = await db.image.create({
    data: {
      name: String(formData.get("name")),
      description: String(formData.get("description")),
      mimeType: String(formData.get("mimeType")),
      width: Number(formData.get("width")),
      height: Number(formData.get("height")),
      size: Number(formData.get("size")),
      src: String(formData.get("src")),
    },
  });

  revalidatePath("/admin/images", "page");
  redirect("/admin/images");
}
