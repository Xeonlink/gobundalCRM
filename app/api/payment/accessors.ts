import axios from "axios";

export async function verifyPayment(paymentId: string | undefined) {
  return await axios.post<{ data: string }>("/api/payment/check", {
    paymentId,
  });
}
