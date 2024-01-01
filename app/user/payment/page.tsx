"use client";

import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import { Refresh } from "@/components/Navigate/Refresh";
import {
  faBox,
  faBoxes,
  faBuilding,
  faCreditCard,
  faLandmark,
  faMobileScreen,
  faMobileScreenButton,
  faNotdef,
  faNoteSticky,
  faPaperPlane,
  faPlusMinus,
  faSignature,
  faSignsPost,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { getCartProducts } from "../action";
import { createOrder } from "./actions";
import { cache, use } from "react";
import { useToggle } from "@/hooks/useToggle";

const getCartProductsCached = cache(getCartProducts);

export default function Page() {
  const cartProducts = use(getCartProductsCached());

  const totalProductPrice = cartProducts.reduce((acc, item) => {
    return (
      acc + (item.product.isSale ? item.product.salePrice : item.product.price) * item.quantity
    );
  }, 0);
  const totalTaxPrice = Math.round(totalProductPrice * 0.1);
  const totalPrice = totalProductPrice + totalTaxPrice;

  const sameAsSender = useToggle(false);

  return (
    <main className="bg-base-100">
      <h2 className="py-6 text-center text-3xl font-bold">주문정보</h2>

      <form action={createOrder} className="contents">
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
              />
            </div>

            <div className="dsy-form-control mt-6">
              <label htmlFor="memo" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faNoteSticky} /> 메모
                </strong>
              </label>
              <SelfValidateInput id="memo" type="text" name="memo" placeholder="메모" />
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
                disabled={sameAsSender.isOn}
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
                disabled={sameAsSender.isOn}
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
                type="text"
                name="receiverAddress"
                placeholder="남원월산로74번길 42"
                required
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
              />
            </div>
          </fieldset>
        </section>

        <section className="container m-auto mt-6 max-w-4xl px-2">
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
                      <span className="min-w-fit text-[#e63740]">
                        {product.isSale
                          ? Math.round((1 - product.salePrice / product.price) * 100) + "%"
                          : product.price === 0
                            ? "100%"
                            : ""}
                      </span>
                      <span className="min-w-fit">
                        <span className="font-bold">
                          {product.isSale
                            ? product.salePrice.toLocaleString()
                            : product.price === 0
                              ? "Free"
                              : product.price.toLocaleString()}
                        </span>
                        {product.price === 0 ? " " : "원 "}
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

          <div className="w-full text-end">
            <div className="my-10 inline-block w-96 max-w-full overflow-hidden rounded-md p-4 text-start text-sm">
              <label htmlFor="total-price" className="flex p-2 px-6">
                <div>
                  <FontAwesomeIcon icon={faBoxes} fontSize={14} /> 상품가격 :
                </div>
                <div className="flex-1 text-right">{totalProductPrice.toLocaleString() + "원"}</div>
              </label>
              <label htmlFor="total-price" className="flex p-2 px-6">
                <div>
                  <FontAwesomeIcon icon={faLandmark} fontSize={14} /> 부가가치세 :
                </div>
                <div className="flex-1 text-right">{totalTaxPrice.toLocaleString() + "원"}</div>
              </label>
              <label htmlFor="total-price" className="flex p-2 px-6">
                <div>
                  <FontAwesomeIcon icon={faWon} fontSize={14} /> 전체가격 :
                </div>
                <div className="flex-1 text-right">{totalPrice.toLocaleString() + "원"}</div>
              </label>
              <div className="dsy-join w-full p-2">
                <Refresh className="dsy-btn dsy-join-item flex-1 border-none bg-orange-100">
                  <FontAwesomeIcon icon={faNotdef} rotation={90} /> 새로고침
                </Refresh>
                <button className="dsy-btn dsy-join-item flex-1 border-none bg-orange-200">
                  <FontAwesomeIcon icon={faCreditCard} /> 결제하기
                </button>
              </div>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
}
