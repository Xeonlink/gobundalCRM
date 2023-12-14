"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function deleteOrder(id: number) {
  await db.order.delete({ where: { id } });

  revalidatePath("/admin/teams", "page");
}
