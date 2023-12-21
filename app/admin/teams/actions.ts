"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";

export async function deleteTeam(id: number) {
  await db.team.delete({ where: { id } });

  revalidatePath("/admin/teams", "page");
}
