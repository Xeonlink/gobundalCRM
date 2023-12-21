"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

export async function updateOrder(id: number, formData: FormData) {
  const senderName = String(formData.get("senderName"));
  const senderPhone = String(formData.get("senderPhone"));
  const sameAsSender = Boolean(formData.get("sameAsSender"));
  const quantities = formData.getAll("quantity");
  const productName = formData.getAll("productName") as string[];
  const productPrice = formData.getAll("productPrice") as string[];

  const _ = await db.order.update({
    where: { id },
    data: {
      date: String(formData.get("date")),
      senderName: senderName,
      senderPhone: senderPhone,
      sameAsSender: sameAsSender,
      receiverName: sameAsSender ? senderName : String(formData.get("receiverName")),
      receiverPhone: sameAsSender ? senderPhone : String(formData.get("receiverPhone")),
      receiverAddress: String(formData.get("receiverAddress")),
      receiverAddressDetail: String(formData.get("receiverAddressDetail")),
      products: {
        createMany: {
          data: formData.getAll("productId").map((productId, index) => ({
            name: String(productName[index]),
            price: Number(productPrice[index]),
            productId: Number(productId),
            quantity: Number(quantities[index]),
          })),
        },
      },
      memo: String(formData.get("memo")),
    },
  });

  revalidatePath("/admin/orders", "page");
  redirect("/admin/orders", RedirectType.replace);
}

export async function getOrder(id: number) {
  return await db.order.findFirstOrThrow({
    where: { id },
    include: {
      products: true,
    },
  });
}
