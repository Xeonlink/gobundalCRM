"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/api/utils";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const senderName = String(formData.get("senderName"));
  const senderPhone = String(formData.get("senderPhone"));
  const sameAsSender = Boolean(formData.get("sameAsSender"));
  const quantities = formData.getAll("quantity");
  const productNames = formData.getAll("productName") as string[];
  const productPrices = formData.getAll("productPrice") as string[];

  const _ = await db.order.create({
    data: {
      userId,
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
            productId: Number(productId),
            name: String(productNames[index]),
            price: Number(productPrices[index]),
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
