import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export function deleteTeam(id: number) {
  return async (_: FormData) => {
    "use server";

    await db.team.delete({ where: { id } });

    revalidatePath("/admin/teams", "page");
  };
}
