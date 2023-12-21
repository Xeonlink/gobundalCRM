"use server";

import { db } from "@/app/api/utils";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

export async function createTeam(formData: FormData) {
  const _ = await db.team.create({
    data: {
      date: String(formData.get("date")),
      leaderName: String(formData.get("leaderName")),
      leaderPhone: String(formData.get("leaderPhone")),
      population: Number(formData.get("population")),
      coupon: String(formData.get("coupon")),
      isLeave: Boolean(formData.get("isLeave")),
      isApproved: Boolean(formData.get("isApproved")),
    },
  });

  revalidatePath("/admin/teams", "page");
  redirect("/admin/teams", RedirectType.replace);
}
