"use client";

import { OrderProduct } from "@/api/orders";
import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import { ProductSelector } from "@/components/Selectors/ProductSelector";
import { useModal } from "@/extra/modal";
import {
  faBox,
  faBuilding,
  faCalculator,
  faCalendarAlt,
  faCoins,
  faFloppyDisk,
  faMobileScreen,
  faMobileScreenButton,
  faNotdef,
  faNoteSticky,
  faPaperPlane,
  faPlus,
  faSignature,
  faSignsPost,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useState } from "react";
import { createOrder } from "./actions";

export default function Page() {
  const modalCtrl = useModal();

  const [products, setProducts] = useState<OrderProduct[]>([]);
  const addProduct = (product: OrderProduct) => {
    setProducts((prev) => [...prev, product]);
  };
  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const openProductSelector = () => {
    modalCtrl.open(
      <ProductSelector onSelect={({ name, price }) => addProduct({ name, price, quantity: 1 })} />,
    );
  };

  return (
    <main>
      <form action={createOrder}>
        {/* Toolbar */}
        <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2  max-sm:flex-col">
          <li>
            {/* Clear */}
            <label className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
              <FontAwesomeIcon icon={faNotdef} rotation={90} />{" "}
              <input type="reset" value="초기화" />
            </label>
          </li>

          <li>
            {/* Save */}
            <button className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
              <FontAwesomeIcon icon={faFloppyDisk} /> 저장
            </button>
          </li>
        </ul>

        <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
          <div className="w-[350px] space-y-6 rounded-xl border bg-white px-8 py-6">
            <div className="dsy-form-control">
              <label htmlFor="date" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faCalendarAlt} /> 주문날짜&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="date"
                name="date"
                type="date"
                required
                max={dayjs().format("YYYY-MM-DD")}
                defaultValue={dayjs().format("YYYY-MM-DD")}
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="sender-name" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faSignature} /> 보내는 사람 이름&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="sender-name"
                name="senderName"
                placeholder="홍길동"
                required
                title="보내는 사람 이름"
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="sender-phone" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faMobileScreen} /> 보내는 사람 전화번호&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="sender-phone"
                name="senderPhone"
                type="tel"
                placeholder="010-0000-0000"
                required
                title="보내는 사람 전화번호"
              />
              {/* <datalist id="sender-phone-list">
                {customers?.data?.data?.map((customer) => (
                  <option key={customer.id} value={customer.phone}></option>
                ))}
              </datalist> */}
            </div>

            <div className="dsy-divider">{/* <FontAwesomeIcon icon={faPaperPlane} /> From */}</div>

            <div className="dsy-form-control">
              <label htmlFor="same-as-sender" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faPaperPlane} /> 보내는 사람과 같음
                </strong>
                <input
                  type="checkbox"
                  name="sameAsSender"
                  id="same-as-sender"
                  className="dsy-toggle-success dsy-toggle"
                />
              </label>
            </div>

            <div className="dsy-form-control">
              <label htmlFor="receiver-name" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faSignature} /> 받는 사람 이름&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="receiver-name"
                name="receiverName"
                placeholder="홍길동"
                required
                title="받는 사람 이름"
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="receiver-phone" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faMobileScreenButton} /> 받는 사람 전화번호&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="receiver-phone"
                name="receiverPhone"
                placeholder="010-0000-0000"
                required
                title="받는 사람 전화번호"
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="receiver-address" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faSignsPost} /> 주소&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="receiver-address"
                name="receiverAddress"
                type="address"
                placeholder="남원월산로74번길 42"
                required
                title="주소"
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="receiver-address-detail" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faBuilding} /> 상세주소&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="receiver-address-detail"
                name="receiverAddressDetail"
                placeholder="단독주택, 1층 101호, ..."
                required
                title="상세주소"
              />
            </div>
          </div>

          <div className="rounded-xl border px-8 py-6">
            <table className="grid w-full grid-cols-[1fr_minmax(0px,6rem)_minmax(0px,4rem)_auto]">
              <thead className="contents">
                <tr className="contents">
                  <th className="text-sm">
                    <FontAwesomeIcon icon={faBox} /> 상품명
                  </th>
                  <th className="text-sm">
                    <FontAwesomeIcon icon={faCoins} /> 가격(원)
                  </th>
                  <th className="text-sm">
                    <FontAwesomeIcon icon={faCalculator} /> 수량
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="contents">
                {products.map((product, index) => (
                  <tr key={index} className="contents">
                    <td className="text-center">
                      <SelfValidateInput
                        id="product-name"
                        type="text"
                        name="productName"
                        required
                        // list="product-name-list"s
                        className="w-full text-center"
                        title="상품명"
                        readOnly
                      />
                    </td>
                    <td className="relative">
                      <SelfValidateInput
                        id="product-price"
                        type="number"
                        name="productPrice"
                        className="w-full text-center"
                        required
                        title="가격"
                        readOnly
                      />
                    </td>
                    <td className="relative">
                      <SelfValidateInput
                        id="product-quantity"
                        name="productQuantity"
                        type="number"
                        className="w-full text-center"
                        required
                        title="수량"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="dsy-btn"
                        onClick={() => removeProduct(index)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              className="dsy-btn-wide dsy-join-item dsy-btn mt-2"
              onClick={openProductSelector}
            >
              <FontAwesomeIcon icon={faPlus} /> 추가하기
            </button>

            <div className="dsy-form-control">
              <label htmlFor="memo" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faNoteSticky} /> 메모
                </strong>
              </label>
              <SelfValidateInput id="memo" name="memo" placeholder="메모" title="메모" />
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
