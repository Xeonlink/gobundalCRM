"use server";

import { db } from "@/app/api/utils";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

export const createTeam = async (formData: FormData) => {
  const leaderName = String(formData.get("leaderName"));

  const _ = await db.team.create({
    data: {
      date: dayjs().format("YYYY-MM-DD"),
      leaderName,
      leaderPhone: String(formData.get("leaderPhone")),
      population: Number(formData.get("population")),
      coupon: String(formData.get("coupon")),
      isLeave: Boolean(formData.get("isLeave")),
      isApproved: Boolean(formData.get("isApproved")),
    },
  });

  revalidatePath("/admin/teams", "page");
  revalidatePath("/kiosk/teams", "page");
  redirect(`/kiosk/teams/complete?leaderName=${encodeURIComponent(leaderName)}`, RedirectType.push);
};
