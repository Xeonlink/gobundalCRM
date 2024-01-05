"use client";

import { DialogOpener } from "@/components/DialogOpener";
import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import { Back } from "@/components/Navigate/Back";
import { ProductSelector } from "@/components/Selectors/ProductSelector";
import { PageProps } from "@/extra/type";
import { useServerAction } from "@/hooks/useServerActions";
import {
  faArrowLeft,
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
import { OrderProduct, Product } from "@prisma/client";
import dayjs from "dayjs";
import { cache, use, useState } from "react";
import { getOrder, updateOrder } from "./actions";

const getOrderCached = cache(getOrder);

export default function Page(props: PageProps<{ orderId: string }>) {
  const id = props.params.orderId;
  const order = use(getOrderCached(+id));
  const [products, setProducts] = useState<Omit<OrderProduct, "orderId">[]>([]);
  const addProduct = (product: Product) => {
    if (products.some((p) => p.productId === product.id)) return alert("이미 추가된 상품입니다.");

    setProducts((prev) => [
      ...prev,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    ]);
  };
  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const [sameAsSender, setSameAsSender] = useState(order!.sameAsSender);
  const onReset = () => {
    setProducts([]);
    setSameAsSender(false);
    setProducts(order.products);
  };

  const [isPending, runAction] = useServerAction(updateOrder.bind(null, +id));
  const onSubmit = async (formData: FormData) => {
    if (products.length === 0) return alert("상품을 추가해주세요.");
    runAction(formData);
  };

  return (
    <main>
      <form action={onSubmit} onReset={onReset}>
        {/* Toolbar */}
        <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2  max-sm:flex-col">
          <li>
            <Back className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
              <FontAwesomeIcon icon={faArrowLeft} /> 뒤로가기
            </Back>
          </li>

          <li>
            {/* Clear */}
            <button
              type="reset"
              className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            >
              <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
            </button>
          </li>

          <li>
            {/* Save */}
            <button className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
              <FontAwesomeIcon icon={faFloppyDisk} /> 저장
            </button>
          </li>
        </ul>

        <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
          <div className="w-96 space-y-4 rounded-xl border px-8 py-6">
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
                defaultValue={order!.date}
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
                defaultValue={order!.senderName}
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
                defaultValue={order!.senderPhone}
              />
              {/* <datalist id="sender-phone-list">
                {customers?.data?.data?.map((customer) => (
                  <option key={customer.id} value={customer.phone}></option>
                ))}
              </datalist> */}
            </div>
          </div>

          <div className="w-96 space-y-4 rounded-xl border px-8 py-6">
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
                  onChange={(e) => setSameAsSender(e.target.checked)}
                  defaultChecked={sameAsSender}
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
                disabled={sameAsSender}
                defaultValue={order!.receiverName}
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
                type="tel"
                placeholder="010-0000-0000"
                required
                title="받는 사람 전화번호"
                disabled={sameAsSender}
                defaultValue={order!.receiverPhone}
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
                defaultValue={order!.receiverAddress}
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
                defaultValue={order!.receiverAddressDetail}
              />
            </div>
          </div>

          <div className="w-96 space-y-4 rounded-xl border px-8 py-6">
            <table className="grid w-full grid-cols-[1fr_minmax(0px,6rem)_minmax(0px,4rem)_auto]">
              <thead className="contents">
                <tr className="contents">
                  <th className="h-8 text-sm">
                    <FontAwesomeIcon icon={faBox} /> 상품명
                  </th>
                  <th className="h-8 text-sm">
                    <FontAwesomeIcon icon={faCoins} /> 가격(원)
                  </th>
                  <th className="h-8 text-sm">
                    <FontAwesomeIcon icon={faCalculator} /> 수량
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="contents">
                {products.map((product, index) => (
                  <tr key={product.productId} className="contents">
                    <td className="text-center">
                      <input
                        id="productId"
                        type="hidden"
                        name="productId"
                        value={product.productId}
                      />
                      <input
                        type="text"
                        name="productName"
                        className="dsy-input-ghost dsy-input w-full text-center"
                        title="상품명"
                        defaultValue={product.name}
                        readOnly
                      />
                    </td>
                    <td className="relative">
                      <input
                        type="text"
                        name="productPrice"
                        className="dsy-input-ghost dsy-input w-full text-center"
                        title="가격"
                        defaultValue={product.price.toLocaleString()}
                        readOnly
                      />
                    </td>
                    <td className="relative">
                      <SelfValidateInput
                        id="quantity"
                        name="quantity"
                        type="number"
                        className="w-full text-center"
                        required
                        title="수량"
                        defaultValue={product.quantity}
                        min={1}
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

            <DialogOpener target="#product-selector" className="dsy-btn dsy-join-item w-full">
              <FontAwesomeIcon icon={faPlus} /> 추가하기
            </DialogOpener>

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

      <ProductSelector onSelect={addProduct} />
    </main>
  );
}
