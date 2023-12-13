"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function deleteTeam(id: number) {
  await db.team.delete({ where: { id } });

  revalidatePath("/admin/teams", "page");
}
