"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/api/utils";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCartProducts() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  return await db.cartProduct.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
  });
}

export async function setCartProductQuantity(productId: number, formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const quantity = Number(formData.get("quantity"));

  await db.cartProduct.update({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    data: {
      quantity,
    },
  });

  revalidatePath("/user/cart", "page");
}

export async function deleteCartProduct(productId: number) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  await db.cartProduct.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  revalidatePath("/user/cart", "page");
}

export async function resetCartProducts() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  await db.cartProduct.deleteMany({
    where: {
      userId,
    },
  });

  revalidatePath("/user/cart", "page");
  redirect("/user/shop");
}
