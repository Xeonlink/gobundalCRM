"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";

export async function deleteOrder(id: number) {
  await db.order.delete({
    where: { id },
    include: {
      products: true,
    },
  });

  revalidatePath("/admin/teams", "page");
}

export async function getOrders(date: string) {
  const orders = await db.order.findMany({
    where: { date },
    include: {
      products: true,
    },
  });

  return orders;
}
