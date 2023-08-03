"use client";

import { useCustomersByName } from "@/api/customers";
import { OrderProduct, defaultOrder, useCreateOrder } from "@/api/orders";
import { useProducts } from "@/api/products";
import { CheckBox } from "@/components/CheckBox";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { cn, toHyphenPhone } from "@/extra/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useModal } from "@/hooks/useModal";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faAddressCard,
  faBox,
  faBoxesStacked,
  faBuilding,
  faCalculator,
  faEquals,
  faMobileScreenButton,
  faNotEqual,
  faNoteSticky,
  faPaperPlane,
  faPlus,
  faSignature,
  faSignsPost,
  faSpinner,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

type ProductPayload<T extends HTMLElement> = { index: number; e: React.ChangeEvent<T> };

export default function Page(_: PageProps) {
  const modalCtrl = useModal();
  const { data: products } = useProducts();
  const enabledProducts = products?.data.filter((item) => item.enabled) ?? [];
  const [order, orderActions] = useTypeSafeReducer(defaultOrder, {
    setDate: (state, date: string) => {
      state.date = date;
    },
    onSenderNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.senderName = e.target.value;
      state.receiverName = !state.sameAsSender ? state.receiverName : e.target.value;
    },
    onSenderPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhone = toHyphenPhone(e.target.value);
      state.senderPhone = newPhone;
      state.receiverPhone = !state.sameAsSender ? state.receiverPhone : newPhone;
    },
    toggleSameAsSender: (state) => {
      state.receiverName = !state.sameAsSender ? state.senderName : "";
      state.receiverPhone = !state.sameAsSender ? state.senderPhone : "";
      state.sameAsSender = !state.sameAsSender;
    },
    onReceiverNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.receiverName = e.target.value;
    },
    onReceiverPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.receiverPhone = toHyphenPhone(e.target.value);
    },
    setReceiverAddress: (state, receiverAddress: string) => {
      state.receiverAddress = receiverAddress;
    },
    onReceiverAddressDetailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.receiverAddressDetail = e.target.value;
    },
    addProduct: (state, product: OrderProduct = { name: "none", price: 0, quantity: 1 }) => {
      state.products.push(product);
    },
    removeProduct: (state, index: number) => {
      state.products.splice(index, 1);
    },
    onProductNameChange: (state, payload: ProductPayload<HTMLSelectElement>) => {
      state.products[payload.index].name = payload.e.target.value;
    },
    onProductPriceChange: (state, payload: ProductPayload<HTMLInputElement>) => {
      state.products[payload.index].price = Number(payload.e.target.value.replaceAll(",", ""));
    },
    onProductQuantityChange: (state, payload: ProductPayload<HTMLInputElement>) => {
      const newQuantity = Number(payload.e.target.value.replaceAll(",", ""));
      if (newQuantity < 0) return;
      state.products[payload.index].quantity = newQuantity;
    },
    onMemoChange: (state, e: React.ChangeEvent<HTMLTextAreaElement>) => {
      state.memo = e.target.value;
    },
    reset: () => defaultOrder,
  });
  const debouncedSenderName = useDebounce(order.senderName, 500);
  const customers = useCustomersByName(debouncedSenderName);
  const createItem = useCreateOrder(order, {
    onSuccess: () => {
      orderActions.reset();
    },
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      orderActions.setReceiverAddress(data.roadAddress);
    },
  });

  const validity = {
    senderName: order.senderName !== "",
    senderPhone: order.senderPhone !== "",
    receiverName: order.receiverName !== "",
    receiverPhone: order.receiverPhone !== "",
    receiverAddress: order.receiverAddress !== "",
    products: order.products.length > 0 && order.products.every((item) => item.name !== "none"),
  };
  const isValid = Object.values(validity).every((item) => item);

  return (
    <div className="m-auto h-full max-w-full overflow-auto p-3">
      <h1 className="py-8 text-center text-3xl font-bold">택배 정보</h1>

      <div className="mb-3 flex flex-row flex-wrap items-start justify-center gap-3">
        <fieldset className="fieldset w-80">
          <legend className="legend">
            <FaIcon icon={faPaperPlane} fontSize={16} /> 보내는 사람
          </legend>

          <div className="field">
            <label htmlFor="sender-name" className="label">
              <FaIcon icon={faSignature} /> 이름
            </label>
            <Input
              id="sender-name"
              placeholder="홍길동"
              disabled={createItem.isLoading}
              value={order.senderName}
              onChange={orderActions.onSenderNameChange}
              invalid={order.senderName === ""}
            />
          </div>

          <div className="field">
            <label htmlFor="sender-phone" className="label">
              <FaIcon icon={faMobileScreenButton} /> 전화번호
            </label>
            <Input
              id="sender-phone"
              list="sender-phone-list"
              type="tel"
              placeholder="010-xxxx-xxxx"
              disabled={createItem.isLoading}
              value={order.senderPhone}
              onChange={orderActions.onSenderPhoneChange}
              invalid={order.senderPhone === ""}
            />
            <datalist id="sender-phone-list">
              {customers?.data?.data?.map((customer) => (
                <option key={customer.id} value={customer.phone}></option>
              ))}
            </datalist>
          </div>
        </fieldset>

        <fieldset className="fieldset w-80">
          <legend className="legend">
            <FaIcon icon={faPaperPlane} fontSize={16} /> 받는 사람
          </legend>

          <div className="field">
            <label htmlFor="same-as-sender" className="label">
              <FaIcon icon={faPaperPlane} /> 보내는 사람과
            </label>
            <CheckBox
              checked={order.sameAsSender}
              disable={createItem.isLoading}
              toggleFn={orderActions.toggleSameAsSender}
              trueContents={[faEquals, " 같음"]}
              falseContents={[faNotEqual, " 같지 않음"]}
            />
          </div>

          <div className="field">
            <label htmlFor="receiver-name" className="label">
              <FaIcon icon={faSignature} /> 이름
            </label>
            <Input
              id="receiver-name"
              placeholder="홍길동"
              disabled={order.sameAsSender || createItem.isLoading}
              value={order.receiverName}
              onChange={orderActions.onReceiverNameChange}
              invalid={order.receiverName === ""}
            />
          </div>

          <div className="field">
            <label htmlFor="receiver-phone" className="label">
              <FaIcon icon={faMobileScreenButton} /> 전화번호
            </label>
            <Input
              id="receiver-phone"
              placeholder="010-xxxx-xxxx"
              disabled={order.sameAsSender || createItem.isLoading}
              value={order.receiverPhone}
              onChange={orderActions.onReceiverPhoneChange}
              invalid={order.receiverPhone === ""}
            />
          </div>

          <div className="field">
            <label htmlFor="receiver-address" className="label">
              <FaIcon icon={faSignsPost} /> 주소
            </label>
            <Input
              id="receiver-address"
              placeholder="남원월산로74번길 42"
              disabled={createItem.isLoading}
              value={order.receiverAddress}
              onChange={postCodePopup.show}
              onClick={postCodePopup.show}
              invalid={order.receiverAddress === ""}
            />
          </div>

          <div className="field">
            <label htmlFor="receiver-address-detail" className="label">
              <FaIcon icon={faBuilding} /> 상세주소
            </label>
            <Input
              id="receiver-address-detail"
              placeholder="단독주택, 1층 101호, ..."
              disabled={createItem.isLoading}
              value={order.receiverAddressDetail}
              onChange={orderActions.onReceiverAddressDetailChange}
              invalid={order.receiverAddressDetail === ""}
            />
          </div>
        </fieldset>

        <fieldset className="fieldset w-80">
          <legend className="legend">
            <FaIcon icon={faBoxesStacked} /> 배송물품
          </legend>

          <table className="grid grid-cols-[1fr_3.5rem_2.5rem] gap-1">
            <thead className="contents">
              <tr className="contents">
                <th className="font-normal">
                  <FaIcon icon={faBox} /> 상품명
                </th>
                <th className="font-normal">
                  <FaIcon icon={faCalculator} /> 수량
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="contents">
              {order.products.map((product, index, arr) => (
                <tr key={index} className="contents">
                  <td className="text-center">
                    <select
                      className={
                        cn("w-full rounded-md bg-white px-3 py-2 disabled:opacity-40", {
                          "animate-shake shadow-red-300": product.name === "none" || !product.name,
                        }) + " shadow-inset-2"
                      }
                      onChange={(e) => orderActions.onProductNameChange({ index, e })}
                      value={!!product.name ? product.name : "none"}
                    >
                      <option value="none">상품을 선택해주세요.</option>
                      {enabledProducts.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="relative">
                    <Input
                      id="product-quantity"
                      type="number"
                      className="text-center"
                      disabled={createItem.isLoading}
                      value={product.quantity.toLocaleString()}
                      onChange={(e) => orderActions.onProductQuantityChange({ index, e })}
                      required
                      invalid={product.quantity <= 0}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn h-full w-10 shadow-none"
                      onClick={() => orderActions.removeProduct(index)}
                      disabled={index === 0}
                    >
                      <FaIcon icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-x-2 text-end">
            <button
              type="button"
              className="btn mt-2 inline-block shadow-none"
              onClick={() => orderActions.addProduct(undefined)}
            >
              <FaIcon icon={faPlus} /> 추가하기
            </button>
          </div>
        </fieldset>

        <fieldset className="fieldset w-80">
          <legend className="legend">
            <FaIcon icon={faPaperPlane} fontSize={16} /> 기타 정보
          </legend>

          <div className="field">
            <label htmlFor="memo" className="label">
              <FaIcon icon={faNoteSticky} /> 메모
            </label>
            <textarea
              id="memo"
              placeholder="메모"
              className="min-h-max w-full rounded-md p-2"
              disabled={createItem.isLoading}
              value={order.memo}
              onChange={orderActions.onMemoChange}
            />
          </div>
        </fieldset>
      </div>

      <div className="mb-10 text-center">
        <button
          type="button"
          className="btn mb-3 w-56 max-w-full py-2"
          disabled={!isValid || createItem.isLoading}
          onClick={() => createItem.mutate()}
        >
          {createItem.isLoading ? (
            <>
              <FaIcon icon={faSpinner} className="animate-spin" /> 배송정보 등록중...
            </>
          ) : (
            <>
              <FaIcon icon={faAddressCard} /> 배송정보 등록
            </>
          )}
        </button>
      </div>
    </div>
  );
}
