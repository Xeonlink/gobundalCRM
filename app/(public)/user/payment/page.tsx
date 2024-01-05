"use client";

import { useCartProducts } from "@/app/api/cart_products/accessors";
import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import { ProductPrice } from "@/components/ProductCard/ProductPrice";
import { ProductSalePercentage } from "@/components/ProductCard/ProductSalePercentage";
import { PortTwo } from "@/extra/PortOne";
import { useToggle } from "@/hooks/useToggle";
import ImgKakaoPay from "@/public/icons/kakao_pay.png";
import ImgNaverPay from "@/public/icons/naver_pay.png";
import ImgTossPay from "@/public/icons/toss_pay.png";
import {
  faBox,
  faBoxes,
  faBuilding,
  faCreditCard,
  faLandmark,
  faMobileScreen,
  faMobileScreenButton,
  faNoteSticky,
  faPaperPlane,
  faPlusMinus,
  faSignature,
  faSignsPost,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PgProvider } from "@portone/browser-sdk/dist/v2/entity";
import * as PortOne from "@portone/browser-sdk/v2";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { createOrder } from "./actions";
import { useModal } from "@/extra/modal/modal";

const validatePayment = async (paymentId: string | undefined) => {
  return await axios.post<{ data: string }>("/api/payment/check", {
    paymentId,
  });
};

export default function Page() {
  const cartProducts = useCartProducts();

  const totalProductPrice = cartProducts
    .map(({ quantity, product: item }) => (item.isSale ? item.salePrice : item.price) * quantity)
    .reduce((pre, cur) => pre + cur, 0);
  const totalTaxPrice = Math.round(totalProductPrice * 0.1);
  const totalPrice = totalProductPrice + totalTaxPrice;

  const sameAsSender = useToggle(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalCtrl = useModal();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const orderId = await createOrder(formData);
    const pgProvider = String(formData.get("pg")) as PgProvider;
    let response: PortOne.PaymentResponse | undefined;

    const portOne = PortTwo.create({
      storeId: process.env.NEXT_PUBLIC_STORE_ID,
      orderName: `${cartProducts[0].product.name} ${cartProducts[0].quantity}개 외 ${cartProducts
        .slice(1)
        .reduce((pre, cur) => pre + cur.quantity, 0)} 개`,
      paymentId: `payment-${orderId}`,
      totalAmount: totalPrice,
    });

    if (pgProvider === "PG_PROVIDER_KAKAOPAY") {
      response = await portOne.requestPayment({
        pgProvider,
        locale: "KO_KR",
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY",
        isTestChannel: true,
      });
    }
    if (pgProvider === "PG_PROVIDER_NAVERPAY") {
      response = await portOne.requestPayment({
        pgProvider,
        locale: "KO_KR",
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY",
        isTestChannel: true,
      });
    }
    if (pgProvider === "PG_PROVIDER_TOSSPAY") {
      response = await portOne.requestPayment({
        pgProvider,
        locale: "KO_KR",
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY",
        isTestChannel: true,
      });
    }

    if (!response) {
      alert("결제에 실패하였습니다. 잠시후 다시 시도해주세요. 에러코드: 87234");
      setIsLoading(false);
      return;
    }

    const paymentValidationResponse = await validatePayment(response.paymentId);
    if (paymentValidationResponse.data.data !== "OK") {
      alert("결제에 실패하였습니다. 잠시후 다시 시도해주세요. 에러코드: 7341");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <main className="bg-base-100">
      <h2 className="py-6 text-center text-3xl font-bold">주문정보</h2>

      <form onSubmit={onSubmit} className="contents">
        <section className="m-auto flex flex-wrap items-start justify-center gap-6 px-2">
          <fieldset className="w-[350px] rounded-xl border bg-white px-8 py-6">
            <legend className="font-bold">
              <FontAwesomeIcon icon={faPaperPlane} /> 보내는 사람
            </legend>

            <div className="dsy-form-control">
              <label htmlFor="sender-name" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faSignature} /> 보내는 사람 이름&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="sender-name"
                type="text"
                name="senderName"
                placeholder="홍길동"
                required
                disabled={isLoading}
              />
            </div>

            <div className="dsy-form-control mt-6">
              <label htmlFor="sender-phone" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faMobileScreen} /> 보내는 사람 전화번호&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="sender-phone"
                type="tel"
                name="senderPhone"
                placeholder="010-0000-0000"
                required
                disabled={isLoading}
              />
            </div>

            <div className="dsy-form-control mt-6">
              <label htmlFor="memo" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faNoteSticky} /> 메모
                </strong>
              </label>
              <SelfValidateInput
                id="memo"
                type="text"
                name="memo"
                placeholder="메모"
                disabled={isLoading}
              />
            </div>
          </fieldset>

          <fieldset className="w-[350px] rounded-xl border bg-white px-8 py-6">
            <legend className="font-bold">
              <FontAwesomeIcon icon={faPaperPlane} rotation={90} /> 받는 사람
            </legend>

            <div className="dsy-form-control">
              <label htmlFor="same-as-sender" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faPaperPlane} /> 보내는 사람과 같음
                </strong>
                <input
                  id="same-as-sender"
                  type="checkbox"
                  name="sameAsSender"
                  className="dsy-toggle-success dsy-toggle"
                  checked={sameAsSender.isOn}
                  onChange={sameAsSender.toggle}
                  disabled={isLoading}
                />
              </label>
            </div>

            <div className="dsy-form-control mt-6">
              <label htmlFor="receiver-name" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faSignature} /> 받는 사람 이름&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="receiver-name"
                type="text"
                name="receiverName"
                placeholder="홍길동"
                required
                disabled={sameAsSender.isOn || isLoading}
              />
            </div>

            <div className="dsy-form-control mt-6">
              <label htmlFor="receiver-phone" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faMobileScreenButton} /> 받는 사람 전화번호&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="receiver-phone"
                type="tel"
                name="receiverPhone"
                placeholder="010-0000-0000"
                required
                disabled={sameAsSender.isOn || isLoading}
              />
            </div>

            <div className="dsy-form-control mt-6">
              <label htmlFor="receiver-address" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faSignsPost} /> 주소&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="receiver-address"
                type="address"
                name="receiverAddress"
                placeholder="남원월산로74번길 42"
                required
                disabled={isLoading}
              />
            </div>

            <div className="dsy-form-control mt-6">
              <label htmlFor="receiver-address-detail" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faBuilding} /> 상세주소&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="receiver-address-detail"
                type="text"
                name="receiverAddressDetail"
                placeholder="단독주택, 1층 101호, ..."
                required
                disabled={isLoading}
              />
            </div>
          </fieldset>
        </section>

        <section className="container m-auto mt-16 max-w-4xl px-2">
          <h3 className="mt-4 flex items-center p-2 sm:hidden">
            <span className="flex-1 text-lg font-bold">배송상품</span>
          </h3>
          <table className="dsy-table w-full min-w-max text-sm sm:mt-4">
            <thead className="max-sm:hidden">
              <tr>
                <th>
                  <FontAwesomeIcon icon={faBox} /> 상품
                </th>
                <th>
                  <FontAwesomeIcon icon={faWon} /> 단가
                </th>
                <th>
                  <FontAwesomeIcon icon={faPlusMinus} /> 수량
                </th>
                <th>
                  <FontAwesomeIcon icon={faWon} /> 가격
                </th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map(({ product, quantity }, idx) => (
                <tr key={product.id}>
                  <td className="max-sm:px-0">
                    <input type="hidden" name="productId" defaultValue={product.id} />
                    <input type="hidden" name="productName" defaultValue={product.name} />
                    <input type="hidden" name="productPrice" defaultValue={product.price} />
                    <input type="hidden" name="quantity" defaultValue={quantity} />
                    <figure className="mr-2 inline-block w-28 align-middle">
                      <Image
                        src={product.images[0].src}
                        alt={product.name}
                        width={product.images[0].width}
                        height={product.images[0].height}
                        className="rounded-md object-cover object-center"
                      />
                    </figure>
                    <span className="max-sm:hidden">{product.name}</span>
                  </td>
                  <td>
                    <div className="flex min-w-max gap-2 max-md:flex-col max-md:gap-1">
                      <ProductSalePercentage
                        className="min-w-fit"
                        isSale={product.isSale}
                        salePrice={product.salePrice}
                        price={product.price}
                      />
                      <span className="min-w-fit">
                        <ProductPrice
                          className="text-inherit"
                          isSale={product.isSale}
                          salePrice={product.salePrice}
                          price={product.price}
                        />
                      </span>
                      <span className="min-w-fit text-sm text-[#999999] line-through">
                        {(
                          (product.isSale ? product.salePrice : product.price) * 5
                        ).toLocaleString() + "원"}
                      </span>
                    </div>
                  </td>
                  <td>{quantity}</td>
                  <td className="max-sm:hidden">
                    <span className="min-w-max">
                      <span className="font-bold">
                        {product.isSale
                          ? (product.salePrice * quantity).toLocaleString()
                          : product.price === 0
                            ? "Free"
                            : (product.price * quantity).toLocaleString()}
                      </span>
                      {product.price === 0 ? " " : "원 "}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end">
            <div className="inline-block w-96 max-w-full overflow-hidden rounded-md p-4 text-start text-sm">
              <label htmlFor="total-price" className="flex p-1 px-6">
                <div>
                  <FontAwesomeIcon icon={faBoxes} fontSize={14} /> 상품가격 :
                </div>
                <div className="flex-1 text-right">{totalProductPrice.toLocaleString() + "원"}</div>
              </label>
              <label htmlFor="total-price" className="flex p-1 px-6">
                <div>
                  <FontAwesomeIcon icon={faLandmark} fontSize={14} /> 부가가치세 :
                </div>
                <div className="flex-1 text-right">{totalTaxPrice.toLocaleString() + "원"}</div>
              </label>
              <label htmlFor="total-price" className="flex p-1 px-6">
                <div>
                  <FontAwesomeIcon icon={faWon} fontSize={14} /> 전체가격 :
                </div>
                <div className="flex-1 text-right">{totalPrice.toLocaleString() + "원"}</div>
              </label>
            </div>
          </div>
        </section>

        <section className="container m-auto my-12 max-w-4xl px-2 text-center">
          <div className="dsy-join-vertical dsy-join w-full">
            <ol className="dsy-join-item flex flex-wrap justify-center gap-4 rounded-lg border p-2">
              <li>
                <label htmlFor="kakao-pay" className="dsy-btn-ghost dsy-btn dsy-btn-lg">
                  <input
                    id="kakao-pay"
                    type="radio"
                    name="pg"
                    value="PG_PROVIDER_KAKAOPAY"
                    className="peer dsy-radio dsy-radio-sm checked:bg-orange-200"
                    required
                    disabled={isLoading}
                  />
                  <Image src={ImgKakaoPay} alt="카카오페이" width={50} />
                </label>
              </li>
              <li>
                <label htmlFor="naver-pay" className="dsy-btn-ghost dsy-btn dsy-btn-lg">
                  <input
                    id="naver-pay"
                    type="radio"
                    name="pg"
                    value="PG_PROVIDER_NAVERPAY"
                    className="peer dsy-radio dsy-radio-sm checked:bg-orange-200"
                    required
                    disabled={isLoading}
                  />
                  <Image src={ImgNaverPay} alt="네이버페이" width={50} />
                </label>
              </li>
              <li>
                <label htmlFor="toss-pay" className="dsy-btn-ghost dsy-btn dsy-btn-lg">
                  <input
                    id="toss-pay"
                    type="radio"
                    name="pg"
                    value="PG_PROVIDER_TOSSPAY"
                    className="peer dsy-radio dsy-radio-sm checked:bg-orange-200"
                    required
                    disabled={isLoading}
                  />
                  <Image src={ImgTossPay} alt="토스페이" width={50} className="scale-[1.8]" />
                </label>
              </li>
            </ol>
          </div>

          <button className="dsy-btn dsy-btn-wide mt-10 border-none bg-orange-200">
            <FontAwesomeIcon icon={faCreditCard} /> 결제하기
          </button>
        </section>
      </form>
    </main>
  );
}
