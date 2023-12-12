"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

export const createTeam = async (formData: FormData) => {
  const _ = await db.team.create({
    data: {
      date: formData.get("date") as string,
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
