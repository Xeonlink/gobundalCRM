"use client";

import { OrderProduct, defaultOrder, useCreateOrder } from "@/api/orders";
import { Input } from "@/components/Input";
import { toHyphenPhone } from "@/extra/utils";
import { useCart } from "@/hooks/useCart";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
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
  faPerson,
  faPlusMinus,
  faSignature,
  faSignsPost,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ProductPayload<T extends HTMLElement> = { index: number; e: React.ChangeEvent<T> };

export default function Page() {
  const cart = useCart();
  const router = useRouter();

  const totalProductPrice = cart.products.reduce((acc, { item, quantity }) => {
    return acc + (item.isSale ? item.salePrice : item.price) * quantity;
  }, 0);
  const totalTaxPrice = Math.round(totalProductPrice * 0.1);
  const totalPrice = totalProductPrice + totalTaxPrice;

  const [order, orderActions] = useTypeSafeReducer(defaultOrder, {
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
    addProduct: (state, product: OrderProduct = { ...defaultOrder.products[0] }) => {
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
    reset: () => defaultOrder,
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => orderActions.setReceiverAddress(data.roadAddress),
  });

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

  const createItem = useCreateOrder(order, {
    onSuccess: () => router.replace("/user"),
  });
  const isLoading = createItem.isLoading;

  return (
    <main className="bg-base-100">
      <h2 className="py-6 text-center text-3xl font-bold">주문정보</h2>

      <form className="m-auto flex flex-wrap items-start justify-center gap-6 px-2">
        <fieldset className="w-[350px] rounded-xl border bg-white px-8 py-6">
          <legend className="font-bold">
            <FontAwesomeIcon icon={faPaperPlane} /> 보내는 사람
          </legend>

          <button type="button" className="dsy-btn-sm dsy-btn">
            <FontAwesomeIcon icon={faPerson} /> 프로필에서 가져오기
          </button>

          <div className="dsy-form-control mt-6">
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

          <div className="dsy-form-control mt-6">
            <label htmlFor="sender-phone" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faMobileScreen} /> 보내는 사람 전화번호&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="sender-phone"
              type="tel"
              placeholder="010-0000-0000"
              disabled={isLoading}
              value={order.senderPhone}
              invalid={!validity.senderPhone}
              onChange={orderActions.onSenderPhoneChange}
              required
            />
          </div>

          <div className="dsy-form-control mt-6">
            <label htmlFor="memo" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faNoteSticky} /> 메모
              </strong>
            </label>
            <Input
              id="memo"
              placeholder="메모"
              disabled={createItem.isLoading}
              value={order.memo}
              onChange={orderActions.onMemoChange}
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
                type="checkbox"
                name="sameAsSender"
                id="same-as-sender"
                className="dsy-toggle-success dsy-toggle"
                checked={order.sameAsSender}
                onChange={orderActions.toggleSameAsSender}
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
            <Input
              id="receiver-name"
              placeholder="홍길동"
              disabled={order.sameAsSender || createItem.isLoading}
              value={order.receiverName}
              onChange={orderActions.onReceiverNameChange}
              invalid={order.receiverName === ""}
            />
          </div>

          <div className="dsy-form-control mt-6">
            <label htmlFor="receiver-phone" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faMobileScreenButton} /> 받는 사람 전화번호&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="receiver-phone"
              placeholder="010-0000-0000"
              disabled={order.sameAsSender || createItem.isLoading}
              value={order.receiverPhone}
              onChange={orderActions.onReceiverPhoneChange}
              invalid={order.receiverPhone === ""}
            />
          </div>

          <div className="dsy-form-control mt-6">
            <label htmlFor="receiver-address" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faSignsPost} /> 주소&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="receiver-address"
              placeholder="남원월산로74번길 42"
              disabled={createItem.isLoading}
              value={order.receiverAddress.replace(/^[^\s]+\s/, "")}
              onChange={postCodePopup.show}
              onClick={postCodePopup.show}
              invalid={order.receiverAddress === ""}
            />
          </div>

          <div className="dsy-form-control mt-6">
            <label htmlFor="receiver-address-detail" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faBuilding} /> 상세주소&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
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
      </form>

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
            {cart.products.map(({ item, quantity }, idx) => (
              <tr key={item.id}>
                <td className="max-sm:px-0">
                  <figure className="mr-2 inline-block w-28 align-middle">
                    <Image
                      src={item.images[0].src}
                      alt={item.name}
                      width={item.images[0].width}
                      height={item.images[0].height}
                      className="rounded-md object-cover object-center"
                    />
                  </figure>
                  <span className="max-sm:hidden">{item.name}</span>
                </td>
                <td>
                  <div className="flex min-w-max gap-2 max-md:flex-col max-md:gap-1">
                    <span className="min-w-fit text-[#e63740]">
                      {item.isSale
                        ? Math.round((1 - item.salePrice / item.price) * 100) + "%"
                        : item.price === 0
                        ? "100%"
                        : ""}
                    </span>
                    <span className="min-w-fit">
                      <span className="font-bold">
                        {item.isSale
                          ? item.salePrice.toLocaleString()
                          : item.price === 0
                          ? "Free"
                          : item.price.toLocaleString()}
                      </span>
                      {item.price === 0 ? " " : "원 "}
                    </span>
                    <span className="min-w-fit text-sm text-[#999999] line-through">
                      {((item.isSale ? item.salePrice : item.price) * 5).toLocaleString() + "원"}
                    </span>
                  </div>
                </td>
                <td>{quantity}</td>
                <td className="max-sm:hidden">
                  <span className="min-w-max">
                    <span className="font-bold">
                      {item.isSale
                        ? (item.salePrice * quantity).toLocaleString()
                        : item.price === 0
                        ? "Free"
                        : (item.price * quantity).toLocaleString()}
                    </span>
                    {item.price === 0 ? " " : "원 "}
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
              <Link
                href="/user/shop"
                type="button"
                className="dsy-join-item dsy-btn flex-1 border-none bg-orange-100"
                onClick={() => cart.reset()}
              >
                <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
              </Link>
              <button
                type="button"
                className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
                disabled={!isValid || isLoading}
              >
                <FontAwesomeIcon icon={faCreditCard} /> 결제하기
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
