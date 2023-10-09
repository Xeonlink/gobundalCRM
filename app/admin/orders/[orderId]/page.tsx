"use client";

import { useCustomersByName } from "@/api/customers";
import { OrderProduct, useOrder, useUpdateOrder } from "@/api/orders";
import { defaultTeam } from "@/api/teams";
import { Input } from "@/components/Input";
import { ProductSelector } from "@/components/Selectors/ProductSelector";
import { useModal } from "@/extra/modal";
import { PageProps } from "@/extra/type";
import { diff, toHyphenPhone } from "@/extra/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBox,
  faBuilding,
  faCalculator,
  faCalendarAlt,
  faCheck,
  faCoins,
  faFloppyDisk,
  faMobileScreenButton,
  faNotdef,
  faNoteSticky,
  faPaperPlane,
  faPlus,
  faSignature,
  faSignsPost,
  faTrashCan,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

type ProductPayload<T extends HTMLElement> = { index: number; e: React.ChangeEvent<T> };
type Params = { orderId: string };

export default function Page(props: PageProps<Params, {}>) {
  const { orderId } = props.params;

  const router = useRouter();
  const modalCtrl = useModal();
  const { data: originOrder } = useOrder(orderId);
  const [order, orderActions] = useTypeSafeReducer(originOrder!, {
    onDateChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.date = e.target.value;
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
    addProduct: (state, product: OrderProduct = { ...originOrder!.products[0] }) => {
      state.products.push(product);
    },
    removeProduct: (state, index: number) => {
      state.products.splice(index, 1);
    },
    onProductNameChange: (state, payload: ProductPayload<HTMLInputElement>) => {
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
    reset: () => originOrder!,
  });
  const debouncedSenderName = useDebounce(order.senderName, 500);
  const customers = useCustomersByName(debouncedSenderName);
  const updateItem = useUpdateOrder(orderId, diff(order, originOrder!), {
    onSuccess: () => router.back(),
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      orderActions.setReceiverAddress(data.roadAddress);
    },
  });
  const openProductSelector = () => {
    modalCtrl.open(
      <ProductSelector
        onSelect={({ name, price }) => orderActions.addProduct({ name, price, quantity: 1 })}
      />,
    );
  };
  const isLoading = updateItem.isLoading;

  const validity = {
    date: order.date !== "",
    senderName: order.senderName.length > 0,
    senderPhone: order.senderPhone.length > 0,
    receiverName: order.receiverName.length > 0,
    receiverPhone: order.receiverPhone.length > 0,
    receiverAddress: order.receiverAddress.length > 0,
    receiverAddressDetail: order.receiverAddressDetail.length > 0,
    products:
      order.products.length > 0 && order.products.every((p) => p.name.length > 0 && p.quantity > 0),
  };
  const isValid = Object.values(validity).every((v) => v);

  return (
    <main>
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap justify-center bg-base-200 py-2 max-sm:flex-col">
        <li>
          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            onClick={orderActions.reset}
          >
            <FontAwesomeIcon icon={faNotdef} rotation={90} />
            초기화
          </button>
        </li>

        <li>
          {/* Save */}
          <button
            type="button"
            className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            disabled={!isValid || isLoading}
            onClick={() => updateItem.mutate()}
          >
            <FontAwesomeIcon icon={faFloppyDisk} /> 저장
          </button>
        </li>
      </ul>

      <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
        <form className="w-[350px] space-y-6 rounded-xl border bg-white px-8 py-6">
          <div className="dsy-form-control">
            <label htmlFor="date" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faCalendarAlt} /> 주문날짜&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="date"
              type="date"
              placeholder="한라봉청 3kg"
              disabled={isLoading}
              defaultValue={originOrder!.date}
              onChange={orderActions.onDateChange}
              invalid={!validity.date}
              max={defaultTeam.date}
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="sender-name" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faSignature} /> 보내는 사람 이름&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="sender-name"
              placeholder="홍길동"
              disabled={isLoading}
              value={order.senderName}
              onChange={orderActions.onSenderNameChange}
              invalid={!validity.senderName}
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="sender-phone" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faWon} /> 보내는 사람 전화번호&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="sender-phone"
              type="tel"
              placeholder="010-0000-0000"
              list="sender-phone-list"
              disabled={isLoading}
              value={order.senderPhone}
              invalid={!validity.senderPhone}
              onChange={orderActions.onSenderPhoneChange}
              required
            />
            <datalist id="sender-phone-list">
              {customers?.data?.data?.map((customer) => (
                <option key={customer.id} value={customer.phone}></option>
              ))}
            </datalist>
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
                checked={order.sameAsSender}
                onChange={orderActions.toggleSameAsSender}
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
            <Input
              id="receiver-name"
              placeholder="홍길동"
              disabled={order.sameAsSender || updateItem.isLoading}
              value={order.receiverName}
              onChange={orderActions.onReceiverNameChange}
              invalid={order.receiverName === ""}
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="receiver-phone" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faMobileScreenButton} /> 받는 사람 전화번호&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="receiver-phone"
              placeholder="010-0000-0000"
              disabled={order.sameAsSender || updateItem.isLoading}
              value={order.receiverPhone}
              onChange={orderActions.onReceiverPhoneChange}
              invalid={order.receiverPhone === ""}
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="receiver-address" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faSignsPost} /> 주소&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="receiver-address"
              placeholder="남원월산로74번길 42"
              disabled={updateItem.isLoading}
              value={order.receiverAddress.replace(/^[^\s]+\s/, "")}
              onChange={postCodePopup.show}
              onClick={postCodePopup.show}
              invalid={order.receiverAddress === ""}
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="receiver-address-detail" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faBuilding} /> 상세주소&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="receiver-address-detail"
              placeholder="단독주택, 1층 101호, ..."
              disabled={updateItem.isLoading}
              value={order.receiverAddressDetail}
              onChange={orderActions.onReceiverAddressDetailChange}
              invalid={order.receiverAddressDetail === ""}
            />
          </div>
        </form>

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
              {order.products.map((product, index) => (
                <tr key={index} className="contents">
                  <td className="text-center">
                    <Input
                      id="product-name"
                      list="product-name-list"
                      className="w-full text-center"
                      disabled={updateItem.isLoading}
                      value={product.name}
                      onChange={(e) => orderActions.onProductNameChange({ index, e })}
                      invalid={product.name.length <= 0}
                    />
                  </td>
                  <td className="relative">
                    <Input
                      id="product-price"
                      className="w-full text-center"
                      value={product.price.toLocaleString()}
                      onChange={(e) => orderActions.onProductPriceChange({ index, e })}
                    />
                  </td>
                  <td className="relative">
                    <Input
                      id="product-quantity"
                      type="number"
                      className="w-full text-center"
                      disabled={updateItem.isLoading}
                      value={product.quantity.toLocaleString()}
                      onChange={(e) => orderActions.onProductQuantityChange({ index, e })}
                      required
                      invalid={product.quantity <= 0}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="dsy-btn"
                      onClick={() => orderActions.removeProduct(index)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-2 text-end">
            <div className="dsy-join inline-block">
              <button
                type="button"
                className="dsy-join-item dsy-btn"
                onClick={() => orderActions.addProduct(undefined)}
              >
                <FontAwesomeIcon icon={faPlus} /> 추가하기
              </button>
              <button type="button" className="dsy-join-item dsy-btn" onClick={openProductSelector}>
                <FontAwesomeIcon icon={faCheck} /> 선택하기
              </button>
            </div>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="memo" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faNoteSticky} /> 메모
              </strong>
            </label>
            <Input
              id="memo"
              placeholder="메모"
              disabled={updateItem.isLoading}
              value={order.memo}
              onChange={orderActions.onMemoChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
