"use client";

import { OrderProduct, defaultOrder, useCreateOrder } from "@/api/orders";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { toHyphenPhone } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faAddressCard,
  faBox,
  faBoxesStacked,
  faBuilding,
  faCalculator,
  faMobileScreenButton,
  faNoteSticky,
  faPaperPlane,
  faSignature,
  faSignsPost,
  faSpinner,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

type ProductPayload<T extends HTMLElement> = { index: number; e: React.ChangeEvent<T> };

export default function Page(_: PageProps) {
  const auth = useAuth();
  const cart = useCart();
  const { products: cartProducts } = cart;
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
    onMemoChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.memo = e.target.value;
    },
    reset: () => defaultOrder,
  });
  const createItem = useCreateOrder(
    {
      ...order,
      products: cartProducts.map(({ item, quantity }) => ({
        name: item.name,
        price: item.isSale ? item.salePrice : item.price,
        quantity,
      })),
    },
    {
      onSuccess: () => {
        if (!confirm("송장등록이 완료되었습니다. 계속 등록하시겠습니까?")) orderActions.reset();
      },
    },
  );
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
    <div>
      <h1 className="py-8 text-center text-3xl font-bold">택배 정보</h1>

      <div className="mx-auto flex flex-wrap items-start justify-evenly gap-2">
        <fieldset className="mt-3 rounded-lg bg-white bg-opacity-40 p-4">
          <legend className="text-center">
            <FaIcon icon={faPaperPlane} fontSize={16} /> 보내는 사람
          </legend>

          <div className="dsy-form-control px-2">
            <label htmlFor="sender-name" className="dsy-label gap-2">
              <span className="dsy-label-text">
                <FaIcon icon={faSignature} /> 이름
              </span>
              <Input
                id="sender-name"
                placeholder="홍길동"
                disabled={createItem.isLoading}
                value={order.senderName}
                onChange={orderActions.onSenderNameChange}
                invalid={order.senderName === ""}
              />
            </label>
          </div>

          <div className="dsy-form-control px-2">
            <label htmlFor="sender-phone" className="dsy-label gap-2">
              <span className="dsy-label-text">
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </span>
              <Input
                id="sender-phone"
                type="tel"
                placeholder="010-xxxx-xxxx"
                disabled={createItem.isLoading}
                value={order.senderPhone}
                onChange={orderActions.onSenderPhoneChange}
                invalid={order.senderPhone === ""}
              />
            </label>
          </div>

          <div className="dsy-form-control px-2">
            <label htmlFor="memo" className="dsy-label gap-2">
              <span className="dsy-label-text">
                <FaIcon icon={faNoteSticky} /> 메모
              </span>
              <Input
                id="memo"
                placeholder="메모"
                disabled={createItem.isLoading}
                value={order.memo}
                onChange={orderActions.onMemoChange}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="mt-3 rounded-lg bg-white bg-opacity-40 p-4">
          <legend className="text-center">
            <FaIcon icon={faPaperPlane} fontSize={16} rotation={90} /> 받는 사람
          </legend>

          <div className="dsy-form-control px-2">
            <label htmlFor="same-as-sender" className="dsy-label gap-2">
              <span className="dsy-label-text">
                <FaIcon icon={faPaperPlane} /> 보내는 사람과
              </span>
              <input
                type="checkbox"
                name="same-as-sender"
                id="same-as-sender"
                className="dsy-toggle-success dsy-toggle"
                checked={order.sameAsSender}
                onChange={orderActions.toggleSameAsSender}
              />
            </label>
          </div>

          <div className="dsy-form-control px-2">
            <label htmlFor="receiver-name" className="dsy-label gap-2">
              <span className="dsy-label-text">
                <FaIcon icon={faSignature} /> 이름
              </span>
              <Input
                id="receiver-name"
                placeholder="홍길동"
                disabled={order.sameAsSender || createItem.isLoading}
                value={order.receiverName}
                onChange={orderActions.onReceiverNameChange}
                invalid={order.receiverName === ""}
              />
            </label>
          </div>

          <div className="dsy-form-control px-2">
            <label htmlFor="receiver-phone" className="dsy-label gap-2">
              <span className="dsy-label-text">
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </span>
              <Input
                id="receiver-phone"
                placeholder="010-xxxx-xxxx"
                disabled={order.sameAsSender || createItem.isLoading}
                value={order.receiverPhone}
                onChange={orderActions.onReceiverPhoneChange}
                invalid={order.receiverPhone === ""}
              />
            </label>
          </div>

          <div className="dsy-form-control px-2">
            <label htmlFor="receiver-address" className="dsy-label gap-2">
              <span className="dsy-label-text">
                <FaIcon icon={faSignsPost} /> 주소
              </span>
              <Input
                id="receiver-address"
                placeholder="남원월산로74번길 42"
                disabled={createItem.isLoading}
                value={order.receiverAddress}
                onChange={postCodePopup.show}
                onClick={postCodePopup.show}
                invalid={order.receiverAddress === ""}
              />
            </label>
          </div>

          <div className="dsy-form-control px-2">
            <label htmlFor="receiver-address-detail" className="dsy-label gap-2">
              <span className="dsy-label-text">
                <FaIcon icon={faBuilding} /> 상세주소
              </span>
              <Input
                id="receiver-address-detail"
                placeholder="단독주택, 1층 101호, ..."
                disabled={createItem.isLoading}
                value={order.receiverAddressDetail}
                onChange={orderActions.onReceiverAddressDetailChange}
                invalid={order.receiverAddressDetail === ""}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="mt-3 max-w-fit rounded-lg bg-white bg-opacity-40 p-4">
          <legend className="text-center">
            <FaIcon icon={faBoxesStacked} /> 배송물품
          </legend>

          <table className="text-sm">
            <thead>
              <tr>
                <th className="p-2 font-normal">
                  <FaIcon icon={faBox} /> 상품명
                </th>
                <th className="p-2 font-normal">
                  <FaIcon icon={faCalculator} /> 수량
                </th>
                <th className="p-2 font-normal">
                  <FaIcon icon={faWon} /> 가격
                </th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map(({ item, quantity }, index) => (
                <tr key={index} className="text-center">
                  <td className="w-28 p-2">{item.name}</td>
                  <td className="w-14 p-2">{quantity}</td>
                  <td className="w-28 p-2">
                    {((item.isSale ? item.salePrice : item.price) * quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="text-center">
                <td className="w-28 p-2"></td>
                <td className="w-14 p-2"></td>
                <td className="w-28 p-2">
                  {cartProducts
                    .map(
                      ({ item, quantity }) =>
                        (item.isSale ? item.salePrice : item.price) * quantity,
                    )
                    .reduce((acc, cur) => acc + cur, 0)
                    .toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      </div>

      <div className="my-4 text-center">
        <button
          type="button"
          className="dsy-btn"
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
