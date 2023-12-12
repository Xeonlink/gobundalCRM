"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RedirectType } from "next/navigation";

export const updateTeam = async (formData: FormData) => {
  "use server";

  const _ = await db.team.update({
    where: { id: parseInt(formData.get("id") as string) },
    data: {
      leaderName: formData.get("leaderName") as string,
      leaderPhone: formData.get("leaderPhone") as string,
      population: parseInt(formData.get("population") as string),
      coupon: formData.get("coupon") as string,
      isLeave: !!formData.get("isLeave"),
      isApproved: !!formData.get("isApproved"),
    },
  });

  revalidatePath("/admin/teams", "page");
  redirect("/admin/teams", RedirectType.replace);
};
