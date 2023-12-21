"use server";

import { db } from "@/app/api/utils";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

export const createTeam = async (formData: FormData) => {
  const _ = await db.team.create({
    data: {
      date: dayjs().format("YYYY-MM-DD"),
      leaderName: formData.get("leaderName") as string,
      leaderPhone: formData.get("leaderPhone") as string,
      population: parseInt(formData.get("population") as string),
      coupon: formData.get("coupon") as string,
      isLeave: !!formData.get("isLeave"),
      isApproved: !!formData.get("isApproved"),
    },
  });

  revalidatePath("/admin/teams", "page");
  revalidatePath("/kiosk/teams", "page");
  redirect("/kiosk/teams/complete", RedirectType.push);
};
