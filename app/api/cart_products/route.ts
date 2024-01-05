import { NextRequest } from "next/server";
import { db } from "../utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = session.user.id;

  const cartProducts = await db.cartProduct.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        include: {
          category: true,
          images: true,
        },
      },
    },
  });

  return Response.json({ data: cartProducts });
}

export async function POST(req: NextRequest) {
  // body validation
  const body = await req.json();
  if (!body.productId) {
    return new Response("Bad Request : body.productId is required", { status: 400 });
  }
  const productId = Number(body.productId);
  if (!body.quantity) {
    return new Response("Bad Request : body.quantity is required", { status: 400 });
  }
  const quantity = Number(body.quantity);

  // user login validation
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = session.user.id;

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
  return new Response("OK", { status: 200 });
}
