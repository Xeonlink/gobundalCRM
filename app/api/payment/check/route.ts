import axios from "axios";
import { NextRequest } from "next/server";
import { db } from "../../utils";

const portOne = axios.create({
  baseURL: "https://api.portone.io",
});

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { paymentId: string | undefined };
  const paymentId = body.paymentId;
  if (!paymentId) {
    return new Response("paymentId is required", { status: 400 });
  }

  const signInResponse = await portOne.post<{ accessToken: string; refreshToken: string }>(
    "/login/api-secret",
    {
      apiSecret: process.env.PORTONE_API_SECRET,
    },
  );
  if (signInResponse.status !== 200) {
    return new Response("Payment Validation API Secret is invalid", { status: 400 });
  }
  const { accessToken } = signInResponse.data;

  const paymentResponse = await portOne.get<Record<string, string>>(`/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (paymentResponse.status !== 200) {
    return new Response("Payment Id is invalid", { status: 400 });
  }
  const { id, amount } = paymentResponse.data;

  const orderId = Number(paymentId.split("-")[1]);
  const order = await db.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      products: true,
    },
  });
  if (!order) {
    return new Response("Order Id is invalid", { status: 400 });
  }

  const totalProductPrice = order.products.reduce(
    (pre, item) => pre + item.price * item.quantity,
    0,
  );
  const totalTaxPrice = Math.round(totalProductPrice * 0.1);
  const totalPrice = totalProductPrice + totalTaxPrice;

  if (totalPrice === Number(amount)) {
    return Response.json({ data: "OK" });
  }

  // 제대로된 결제가 이루어지지 못한 경우 - 아래의 코드로 이동
  const _ = await db.order.delete({
    where: {
      id: orderId,
    },
  });

  const cancelPaymentResponse = await portOne.post(`/payments/${paymentId}/cancel`, {
    reason: "결제한 금액과 주문 금액이 상이함",
  });
  if (cancelPaymentResponse.status !== 200) {
    return Response.json(
      {
        errorCode: 7294,
        message: "결제한 금액과 주문 금액이 상이하며, 주문 취소에 실패함.",
      },
      {
        status: 400,
      },
    );
  }

  return Response.json(
    {
      errorCode: 7234,
      message: "결제한 금액과 주문 금액이 상이함",
    },
    {
      status: 400,
    },
  );
}
