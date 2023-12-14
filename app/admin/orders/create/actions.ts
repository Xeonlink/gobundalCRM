"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

export const createOrder = async (formData: FormData) => {
  console.log(formData.getAll("productName"));

  // const _ = await db.order.create({
  //   data: {
  //     date: formData.get("date") as string,
  //     senderName: formData.get("senderName") as string,
  //     senderPhone: formData.get("senderPhone") as string,
  //     sameAsSender: !!formData.get("sameAsSender"),
  //     receiverName: formData.get("receiverName") as string,
  //     receiverPhone: formData.get("receiverPhone") as string,
  //     receiverAddress: formData.get("receiverAddress") as string,
  //     receiverAddressDetail: formData.get("receiverAddressDetail") as string,
  //     products: {
  //       create: [
  //         {

  //         },
  //       ],
  //     },
  //     memo: formData.get("memo") as string,
  //   },
  // });

  revalidatePath("/admin/orders", "page");
  redirect("/admin/orders", RedirectType.replace);
};
