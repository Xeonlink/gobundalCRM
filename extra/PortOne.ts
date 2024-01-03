import * as PortOne from "@portone/browser-sdk/v2";

type CreateOptions = {
  storeId: string;
  orderName: string;
  paymentId: string;
  totalAmount: number;
};

type RequestOptions = Omit<
  PortOne.PaymentRequest,
  "storeId" | "orderName" | "paymentId" | "totalAmount"
>;

export class PortTwo {
  private options: CreateOptions;

  private constructor(createOptions: CreateOptions) {
    this.options = createOptions;
  }

  public static create(createOptions: CreateOptions) {
    return new PortTwo(createOptions);
  }

  public requestPayment(requestOptions: RequestOptions) {
    const portOneRequestOptions: PortOne.PaymentRequest = {
      ...requestOptions,
      ...this.options,
    };

    return PortOne.requestPayment(portOneRequestOptions);
  }
}
