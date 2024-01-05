"use server";

import { apiRoot } from "@/app/api/utils";
import { db } from "@/app/api/utils";
import axios from "axios";

export async function uploadImage(formData: FormData) {
  const file = formData.get("image") as File;
  const fileArrayBuffer = await file.arrayBuffer();

  // s3 signed url에 파일을 넣는 과정
  const config = { params: { mimeType: file.type } };
  const { data: signedUrl } = await apiRoot.get<string>("/assets/signedUrl", config);
  const { protocol, hostname, pathname } = new URL(signedUrl);
  const src = await axios
    .put(signedUrl, fileArrayBuffer)
    .then(() => `${protocol}//${hostname}${pathname}`);

  const data = await db.productImage.create({
    data: {
      name: file.name,
      size: file.size,
      mimeType: file.type,
      width: Number(formData.get("width") as string),
      height: Number(formData.get("height") as string),
      src,
    },
  });

  return data;
}
