"use client";

import { useCustomersByName } from "@/api/customers";
import { RawOrder, useCreateOrder } from "@/api/orders";
import { useProducts } from "@/api/products";
import { BlurInfo } from "@/components/BlurInfo";
import { CheckBox } from "@/components/CheckBox";
import { Input } from "@/components/Input";
import { cls, toHyphenPhone } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useToggle } from "@/hooks/useToggle";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import ImgInitialEx from "@/public/images/initial_ex.png";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faBox,
  faBoxesStacked,
  faBuilding,
  faCalculator,
  faCoins,
  faEquals,
  faFloppyDisk,
  faMobileScreenButton,
  faNotEqual,
  faNotdef,
  faPaperPlane,
  faSignature,
  faSignsPost,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const defaultOrder: RawOrder = {
  senderName: "",
  senderPhone: "",
  sameAsSender: false,
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverAddressDetail: "",
  productName: "상품을 선택해주세요.",
  productPrice: 0,
  quantity: 1,
  memo: "",
};

export default function Page() {
  useAuth();
  const navigate = useRouter();
  const senderInfo = useToggle(false);
  const initialInfo = useToggle(false);
  const productInfo = useToggle(false);
  const [order, orderActions] = useTypeSafeReducer(defaultOrder, {
    onSenderNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.senderName = e.target.value;
    },
    onSenderPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.senderPhone = toHyphenPhone(e.target.value);
    },
    toggleSameAsSender: (state) => {
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
    setProductName: (state, e: React.ChangeEvent<HTMLSelectElement>) => {
      state.productName = e.target.value;
    },
    setProductPrice: (state, productPrice: number) => {
      state.productPrice = productPrice;
    },
    onQuantityChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "") {
        state.quantity = 0;
        return;
      }
      const newQuantity = parseInt(e.target.value.replaceAll(",", ""));
      if (!newQuantity) return;
      state.quantity = newQuantity;
    },
    onMemoChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.memo = e.target.value;
    },
    reset: (_) => {
      return defaultOrder;
    },
  });
  const finalOrder: RawOrder = {
    ...order,
    receiverName: order.sameAsSender ? order.senderName : order.receiverName,
    receiverPhone: order.sameAsSender ? order.senderPhone : order.receiverPhone,
  };
  const debouncedSenderName = useDebounce(order.senderName, 500);
  const customers = useCustomersByName(debouncedSenderName);
  const products = useProducts();

  const validity = {
    senderName: finalOrder.senderName.length > 0,
    senderPhone: finalOrder.senderPhone.length > 0,
    receiverName: finalOrder.receiverName.length > 0,
    receiverPhone: finalOrder.receiverPhone.length > 0,
    receiverAddress: finalOrder.receiverAddress.length > 0,
    receiverAddressDetail: finalOrder.receiverAddressDetail.length > 0,
    productName: finalOrder.productName !== "상품을 선택해주세요.",
    productPrice: finalOrder.productPrice > 0,
    quantity: finalOrder.quantity > 0,
  };
  const isValid = Object.values(validity).every((v) => v);

  const createOrder = useCreateOrder(finalOrder, {
    onSuccess: () => navigate.back(),
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      orderActions.setReceiverAddress(data.roadAddress);
    },
  });

  return (
    <main className='p-3 h-full flex-1 overflow-auto'>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <button type='button' className='m-box px-3 py-2 m-hover' onClick={navigate.back}>
          <FaIcon icon={faArrowLeft} /> 뒤로가기
        </button>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Clear */}
        <button
          type='button'
          className='m-box px-3 py-2 m-hover disabled:opacity-40'
          disabled={defaultOrder === order || createOrder.isLoading}
          onClick={() => orderActions.reset()}
        >
          <FaIcon icon={faNotdef} rotation={90} /> 초기화
        </button>

        {/* Save */}
        <button
          type='button'
          className='m-box px-3 py-2 m-hover disabled:opacity-40'
          disabled={!isValid || createOrder.isLoading}
          onClick={() => createOrder.mutate()}
        >
          {createOrder.isLoading ? (
            <>
              <FaIcon icon={faSpinner} className='animate-spin' /> 저장중...
            </>
          ) : (
            <>
              <FaIcon icon={faFloppyDisk} /> 저장
            </>
          )}
        </button>
      </div>

      {/* Form */}
      <form action='' onSubmit={(e) => e.preventDefault()}>
        <div className='flex gap-3 justify-evenly flex-wrap items-start'>
          <fieldset className='fieldset'>
            <legend className='btn text-lg bg-transparent p-2' onClick={senderInfo.toggle}>
              <FaIcon icon={faPaperPlane} fontSize={16} />
              &nbsp;보내는 사람&nbsp;
              <FaIcon icon={faCircleQuestion} fontSize={16} />
            </legend>

            <BlurInfo open={senderInfo.isOn} closeFn={senderInfo.toggle}>
              실제 배송정보에는 필요하지 않으나, <br />
              택배사고 발생 시 연락을 위해 <br />
              입력해주세요.
            </BlurInfo>

            <div className='field'>
              <label htmlFor='sender-name' className='label'>
                <FaIcon icon={faSignature} /> 이름
              </label>
              <Input
                id='sender-name'
                type='text'
                placeholder='홍길동'
                disabled={createOrder.isLoading}
                value={order.senderName}
                onChange={orderActions.onSenderNameChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='sender-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <Input
                id='sender-phone'
                list='sender-phone-list'
                type='tel'
                placeholder='010-xxxx-xxxx'
                disabled={createOrder.isLoading}
                value={order.senderPhone}
                onChange={orderActions.onSenderPhoneChange}
                required
              />
              <datalist id='sender-phone-list'>
                {customers?.data?.data?.map((customer) => (
                  <option key={customer.id} value={customer.phone}></option>
                ))}
              </datalist>
            </div>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='text-lg m-box p-2 text-center bg-transparent'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 받는 사람
            </legend>

            <div className='field'>
              <label htmlFor='same-as-sender' className='label'>
                <FaIcon icon={faPaperPlane} /> 보내는 사람과
              </label>
              <CheckBox
                checked={order.sameAsSender}
                disable={createOrder.isLoading}
                toggleFn={orderActions.toggleSameAsSender}
                trueElements={[<FaIcon icon={faEquals} />, " 동일"]}
                falseElements={[<FaIcon icon={faNotEqual} />, " 동일하지 않음"]}
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-name' className='label'>
                <FaIcon icon={faSignature} /> 이름
              </label>
              <Input
                id='receiver-name'
                type='text'
                placeholder='홍길동'
                disabled={order.sameAsSender || createOrder.isLoading}
                value={finalOrder.receiverName}
                onChange={orderActions.onReceiverNameChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <Input
                id='receiver-phone'
                type='text'
                placeholder='010-xxxx-xxxx'
                disabled={order.sameAsSender || createOrder.isLoading}
                value={finalOrder.receiverPhone}
                onChange={orderActions.onReceiverPhoneChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-address' className='label'>
                <FaIcon icon={faSignsPost} /> 주소
              </label>
              <Input
                id='receiver-address'
                type='text'
                placeholder='남원월산로74번길 42'
                disabled={createOrder.isLoading}
                value={order.receiverAddress}
                onChange={postCodePopup.show}
                onClick={postCodePopup.show}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-address-detail' className='label'>
                <FaIcon icon={faBuilding} /> 상세주소
              </label>
              <Input
                id='receiver-address-detail'
                type='text'
                placeholder='단독주택, 1층 101호, ...'
                disabled={createOrder.isLoading}
                value={order.receiverAddressDetail}
                onChange={orderActions.onReceiverAddressDetailChange}
                required
              />
            </div>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='text-lg m-box p-2 text-center bg-transparent'>
              <FaIcon icon={faBoxesStacked} /> 배송물품
            </legend>

            <BlurInfo open={productInfo.isOn} closeFn={productInfo.toggle}>
              묶음 배송은 10kg까지만 가능합니다. <br />
              배송해야할 상품이 많은 경우, <br />
              배송정보을 나눠서 작성하셔야합니다. <br />
            </BlurInfo>

            <BlurInfo open={initialInfo.isOn} closeFn={initialInfo.toggle}>
              다른 손님의 택배와 구분하고, <br />
              오배송을 줄이기 위해, <br />
              박스에 이니셜을 적어주세요. <br />
            </BlurInfo>

            <div className='field'>
              <label
                className='btn label bg-transparent shadow-none text-start'
                onClick={productInfo.toggle}
              >
                <FaIcon icon={faBox} /> 상품선택 <FaIcon icon={faCircleQuestion} />
              </label>
              <select
                name='product-name'
                id='product-name'
                className={cls("rounded-md bg-white px-3 py-2 w-full disabled:opacity-40", {
                  "shake border-red-300 border-2": !validity.productName,
                })}
                disabled={createOrder.isLoading}
                value={order.productName}
                onChange={orderActions.setProductName}
                required
              >
                <option value='상품을 선택해주세요.'>상품을 선택해주세요.</option>
                {products.data?.data.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='field'>
              <label htmlFor='sale-price' className='label'>
                <FaIcon icon={faCoins} /> 가격
              </label>
              <Input
                id='sale-price'
                type='text'
                disabled={true}
                value={order.productPrice}
                readOnly
              />
              <div className='absolute bottom-2 right-3'>원</div>
            </div>

            <div className='field'>
              <label htmlFor='sale-price' className='label'>
                <FaIcon icon={faCalculator} /> 수량
              </label>
              <Input
                id='sale-price'
                type='text'
                disabled={createOrder.isLoading}
                value={order.quantity.toLocaleString()}
                onChange={orderActions.onQuantityChange}
                required
                invalid={!validity.quantity}
              />
              <div className='absolute bottom-2 right-3'>개</div>
            </div>
          </fieldset>
        </div>
      </form>
    </main>
  );
}
