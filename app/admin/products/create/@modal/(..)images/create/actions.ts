"use server";

import { db } from "@/app/api/utils";
import { RedirectType, redirect } from "next/navigation";

export async function createImage(formData: FormData) {
  const _ = await db.image.create({
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      mimeType: formData.get("mimeType") as string,
      width: Number(formData.get("width")),
      height: Number(formData.get("height")),
      size: Number(formData.get("size")),
      src: formData.get("src") as string,
    },
  });
}
