import { useEffect } from "react";

export function usePortOne() {
  useEffect(() => {
    if (!window.IMP) {
      throw new Error("결제도중 에러가 발생했습니다. 잠시후 다시 시도해주세요. 에러코드 : 34897");
    }

    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_IMP);
  }, []);

  const callback = async (response) => {
    console.log(response);
  };

  const requestPayment = async () => {
    const IMP = window.IMP;
    console.log("usePortOne hook, NEXT_PUBLIC_IAMPORT_IMP: ", process.env.NEXT_PUBLIC_IAMPORT_IMP);

    const paymentData = {
      pg: "kakaopay.TC0ONETIME",
      merchant_uid: "merchant_" + crypto.randomUUID(),
      name: "주문명:결제테스트",
      amount: 1000,
      isTest,
    };

    console.log("crypto.randomUUID : ", crypto.randomUUID());

    IMP.request_pay(paymentData, callback);
  };

  return { requestPayment };
}
