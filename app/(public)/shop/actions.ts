"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/api/utils";
import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getProductCategories() {
  return await db.productCategory.findMany({
    where: {
      enabled: true,
    },
  });
}

export async function getProductsByCategory(categoryId?: number) {
  if (!!categoryId) {
    return await db.product.findMany({
      where: {
        categoryId,
        enabled: true,
      },
      include: {
        images: true,
      },
    });
  } else {
    return await db.product.findMany({
      where: {
        enabled: true,
      },
      include: {
        images: true,
      },
    });
  }
}

export async function createCartProduct(productId: number) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const cartProduct = await db.cartProduct.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (!cartProduct) {
    await db.cartProduct.create({
      data: {
        userId,
        quantity: 1,
        productId,
      },
    });
  } else {
    await db.cartProduct.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity: cartProduct.quantity + 1,
      },
    });
  }

  redirect("/payment");
}

export async function createCartProductByForm(productId: number, formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const quantity = Number(formData.get("quantity"));

  const cartProduct = await db.cartProduct.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (!cartProduct) {
    await db.cartProduct.create({
      data: {
        userId,
        quantity,
        productId,
      },
    });
  } else {
    await db.cartProduct.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity: cartProduct.quantity + quantity,
      },
    });
  }

  revalidatePath("/user/cart", "page");
}
