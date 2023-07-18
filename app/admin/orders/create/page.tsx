"use client";

import { RawOrder, postOrder } from "@/api/orders";
import { BlurInfo } from "@/components/BlurInfo";
import { CheckBox } from "@/components/CheckBox";
import { toHyphenPhone } from "@/extra/utils";
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
  faEquals,
  faFloppyDisk,
  faMobileScreenButton,
  faNotEqual,
  faNotdef,
  faPaperPlane,
  faSignature,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const defaultOrder: RawOrder = {
  senderName: "",
  senderPhone: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverAddressDetail: "",
  productName: "상품을 선택해주세요.",
  initial: "",
};

export default function OrdersCreatePage() {
  const navigate = useRouter();
  const senderInfo = useToggle(false);
  const initialInfo = useToggle(false);
  const productInfo = useToggle(false);
  const sameAsSender = useToggle(false);

  const [extraProductName, setExtraProductName] = useState("");
  const [order, orderActions] = useTypeSafeReducer(defaultOrder, {
    onSenderNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.senderName = e.target.value;
    },
    onSenderPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.senderPhone = toHyphenPhone(e.target.value);
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
    onProductNameChange: (state, e: React.ChangeEvent<HTMLSelectElement>) => {
      state.productName = e.target.value;
    },
    onInitialChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.initial = e.target.value;
    },
    reset: (_) => {
      return defaultOrder;
    },
  });

  const onExtraProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtraProductName(e.target.value);
  };

  const finalOrder: RawOrder = {
    ...order,
    receiverName: sameAsSender.isOn ? order.senderName : order.receiverName,
    receiverPhone: sameAsSender.isOn ? order.senderPhone : order.receiverPhone,
    productName: order.productName === "기타" ? extraProductName : order.productName,
  };

  const validity = {
    senderName: finalOrder.senderName.length > 0,
    senderPhone: finalOrder.senderPhone.length > 0,
    receiverName: finalOrder.receiverName.length > 0,
    receiverPhone: finalOrder.receiverPhone.length > 0,
    receiverAddress: finalOrder.receiverAddress.length > 0,
    receiverAddressDetail: finalOrder.receiverAddressDetail.length > 0,
    productName: finalOrder.productName !== "상품을 선택해주세요.",
    initial: finalOrder.initial.length > 0,
  };

  const isRegistBtnValid = Object.values(validity).every((v) => v);

  const createOrder = useMutation({
    mutationFn: () => postOrder(finalOrder),
    onSuccess: () => {
      alert("배송정보 등록이 완료되었습니다.");
      clearForm();
    },
  });

  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      orderActions.setReceiverAddress(data.roadAddress);
    },
  });

  const clearForm = () => {
    orderActions.reset();
    setExtraProductName("");
    sameAsSender.off();
  };

  const clearity = {
    senderName: finalOrder.senderName === defaultOrder.senderName,
    senderPhone: finalOrder.senderPhone === defaultOrder.senderPhone,
    receiverName: finalOrder.receiverName === defaultOrder.receiverName,
    receiverPhone: finalOrder.receiverPhone === defaultOrder.receiverPhone,
    receiverAddress: finalOrder.receiverAddress === defaultOrder.receiverAddress,
    receiverAddressDetail: finalOrder.receiverAddressDetail === defaultOrder.receiverAddressDetail,
    productName: finalOrder.productName === defaultOrder.productName,
    initial: finalOrder.initial === defaultOrder.initial,
    sameAsSender: sameAsSender.isOn === false,
  };

  const isCleared = Object.values(clearity).every((v) => v);

  return (
    <main className='p-3'>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <button type='button' className='m-box px-3 py-2 m-hover' onClick={navigate.back}>
          <FontAwesomeIcon icon={faArrowLeft} width={22} height={22} className='mr-1' />
          <span>뒤로가기</span>
        </button>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Clear */}
        <button
          type='button'
          className='m-box px-3 py-2 m-hover disabled:opacity-40'
          disabled={isCleared}
          onClick={clearForm}
        >
          <FontAwesomeIcon icon={faNotdef} width={22} height={22} rotation={90} className='mr-1' />
          <span>초기화</span>
        </button>

        {/* Save */}
        <button
          type='button'
          className='m-box px-3 py-2 m-hover disabled:opacity-40'
          disabled={!isRegistBtnValid || createOrder.isLoading}
          onClick={() => createOrder.mutate()}
        >
          <FontAwesomeIcon icon={faFloppyDisk} width={22} height={22} className='mr-1' />
          <span>저장</span>
        </button>
      </div>

      {/* Form */}
      <form action='' onSubmit={(e) => e.preventDefault()}>
        <div className='flex gap-3 justify-evenly flex-wrap items-start'>
          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10 relative'>
            <legend className='text-lg shadow-md rounded-md px-2 py-2' onClick={senderInfo.toggle}>
              <FontAwesomeIcon
                icon={faPaperPlane}
                width={15}
                height={15}
                className='mr-2 opacity-75'
              />
              <span>보내는 사람</span>
              <FontAwesomeIcon
                icon={faCircleQuestion}
                width={16}
                height={16}
                className='ml-2 opacity-75'
              />
            </legend>

            <BlurInfo open={senderInfo.isOn} closeFn={senderInfo.toggle}>
              실제 배송정보에는 필요하지 않으나, <br />
              택배사고 발생 시 연락을 위해 <br />
              입력해주세요.
            </BlurInfo>

            <label htmlFor='sender-name' className='block mb-1 pl-2'>
              <FontAwesomeIcon
                icon={faSignature}
                width={20}
                height={20}
                className='mr-1 opacity-75'
              />
              <span>이름</span>
            </label>
            <input
              id='sender-name'
              type='text'
              placeholder='홍길동'
              className='rounded-md px-3 py-2 mb-3 w-full input-invalid disabled:opacity-40'
              disabled={createOrder.isLoading}
              value={order.senderName}
              onChange={orderActions.onSenderNameChange}
              required
            />

            <label htmlFor='sender-phone' className='block mb-1 pl-2'>
              <FontAwesomeIcon
                icon={faMobileScreenButton}
                width={20}
                height={20}
                className='mr-1 opacity-75'
              />
              <span>전화번호</span>
            </label>
            <input
              id='sender-phone'
              type='tel'
              placeholder='010-xxxx-xxxx'
              className='input'
              disabled={createOrder.isLoading}
              value={order.senderPhone}
              onChange={orderActions.onSenderPhoneChange}
              required
            />
          </fieldset>

          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10'>
            <legend className='text-lg shadow-md rounded-md px-2 py-2'>
              <FontAwesomeIcon
                icon={faPaperPlane}
                width={15}
                height={15}
                rotation={90}
                className='mr-2 opacity-75'
              />
              <span>받는 사람</span>
            </legend>

            <label htmlFor='same-as-sender' className='block mb-1 pl-2'>
              <FontAwesomeIcon
                icon={faPaperPlane}
                width={15}
                height={15}
                className='mr-2 opacity-75'
              />
              <span>보내는 사람과</span>
            </label>
            <CheckBox
              aria-diabled={createOrder.isLoading}
              checked={sameAsSender.isOn}
              toggleFn={sameAsSender.toggle}
              trueIcon={faEquals}
              falseIcon={faNotEqual}
            />

            <label htmlFor='receiver-name' className='block mb-1 pl-2'>
              <FontAwesomeIcon
                icon={faSignature}
                width={20}
                height={20}
                className='mr-1 opacity-75'
              />
              <span>이름</span>
            </label>
            <input
              id='receiver-name'
              type='text'
              placeholder='홍길동'
              className='input'
              disabled={sameAsSender.isOn || createOrder.isLoading}
              value={sameAsSender.isOn ? order.senderName : order.receiverName}
              onChange={orderActions.onReceiverNameChange}
              required
            />

            <label htmlFor='receiver-phone' className='block mb-1 pl-2'>
              <FontAwesomeIcon
                icon={faMobileScreenButton}
                width={20}
                height={20}
                className='mr-1 opacity-75'
              />
              <span>전화번호</span>
            </label>
            <input
              id='receiver-phone'
              type='text'
              placeholder='010-xxxx-xxxx'
              className='input'
              disabled={sameAsSender.isOn || createOrder.isLoading}
              value={sameAsSender.isOn ? order.senderPhone : order.receiverPhone}
              onChange={orderActions.onReceiverPhoneChange}
              required
            />

            <label htmlFor='receiver-address' className='block mb-1 pl-2'>
              <FontAwesomeIcon
                icon={faSignsPost}
                width={20}
                height={20}
                className='mr-1 opacity-75'
              />
              <span>주소</span>
            </label>
            <input
              id='receiver-address'
              type='text'
              placeholder='남원월산로74번길 42'
              className='input'
              disabled={createOrder.isLoading}
              value={order.receiverAddress}
              onClick={postCodePopup.show}
              required
            />

            <label htmlFor='receiver-address-detail' className='block mb-1 pl-2'>
              <FontAwesomeIcon
                icon={faBuilding}
                width={20}
                height={20}
                className='mr-1 opacity-75'
              />
              <span>상세주소</span>
            </label>
            <input
              id='receiver-address-detail'
              type='text'
              placeholder='단독주택, 1층 101호, ...'
              className='input'
              disabled={createOrder.isLoading}
              value={order.receiverAddressDetail}
              onChange={orderActions.onReceiverAddressDetailChange}
              required
            />
          </fieldset>

          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10 relative'>
            <legend className='text-lg shadow-md rounded-md px-2 py-2'>
              <FontAwesomeIcon
                icon={faBoxesStacked}
                width={18}
                height={18}
                className='mr-2 opacity-75'
              />
              <span>배송물품</span>
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

            <label className='block mb-1 pl-2' onClick={productInfo.toggle}>
              <FontAwesomeIcon icon={faBox} width={20} height={20} className='mr-1 opacity-75' />
              상품종류
              <FontAwesomeIcon
                icon={faCircleQuestion}
                width={20}
                height={20}
                className='ml-1 opacity-75'
              />
            </label>
            <select
              name='product-name'
              id='product-name'
              className={`rounded-md bg-white px-3 py-2 mb-3 w-full disabled:opacity-40 ${
                validity.productName ? "" : "shake border-red-300 border-2"
              }`}
              disabled={createOrder.isLoading}
              value={order.productName}
              onChange={orderActions.onProductNameChange}
              required
            >
              <option value='상품을 선택해주세요.'>상품을 선택해주세요.</option>
              <option value='체험귤 5kg'>체험귤 5kg</option>
              <option value='체험귤 10kg'>체험귤 10kg</option>
              <option value='체험귤 5kg x 2'>체험귤 5kg x 2</option>
              <option value='기타'>기타</option>
            </select>
            {order.productName === "기타" ? (
              <input
                id='product-name'
                type='text'
                placeholder='귤5kg, 귤10kg, 귤5kg x 2, ...'
                className='input'
                disabled={createOrder.isLoading}
                value={extraProductName}
                onChange={onExtraProductNameChange}
                required
              />
            ) : null}

            <label className='block mb-1 pl-2' onClick={initialInfo.toggle}>
              <FontAwesomeIcon
                icon={faSignature}
                width={20}
                height={20}
                className='mr-1 opacity-75'
              />
              <span>이니셜</span>
              <FontAwesomeIcon
                icon={faCircleQuestion}
                width={20}
                height={20}
                className='ml-1 opacity-75'
              />
            </label>
            <input
              id='initial'
              type='text'
              placeholder='HGD, love you, 하트모양, ...'
              className='input'
              disabled={createOrder.isLoading}
              value={order.initial}
              onChange={orderActions.onInitialChange}
              required
            />
            <Image
              src={ImgInitialEx}
              alt='귤 상자에 자신만의 이니셜이 그려져있는 사진'
              className='rounded-md max-w-full'
              width={250}
              placeholder='blur'
            />
          </fieldset>
        </div>
      </form>
    </main>
  );
}
