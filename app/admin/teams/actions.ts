import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export function deleteTeam(id: number) {
  return async (formData: FormData) => {
    "use server";

    const result = await db.team.delete({ where: { id } });

    console.log(result);

    revalidatePath("/admin/teams");
  };
}
