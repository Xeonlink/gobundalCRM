"use client";

import { PageProps } from "@/extra/type";
import { Order } from "@/api/orders";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import { toHyphenPhone } from "@/extra/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faBox,
  faBoxesStacked,
  faBuilding,
  faEquals,
  faMobileScreenButton,
  faNotEqual,
  faPaperPlane,
  faSignature,
  faSignsPost,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { useModal } from "@/hooks/useModal";
import { SenderInfoDialog } from "./SenderInfoDialog";
import { useToggle } from "@/hooks/useToggle";
import { useState } from "react";
import ImgInitialEx from "@/public/images/initial_ex.png";
import Image from "next/image";

const defaultOrder: Omit<Order, "date" | "id"> = {
  senderName: "",
  senderPhone: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverAddressDetail: "",
  productName: "상품을 선택해주세요.",
  initial: "",
};

export default function KioskOrderPage(_: PageProps) {
  const senderInfo = useToggle(false);
  const initialInfo = useToggle(false);
  const productInfo = useToggle(false);
  const [sameAsSender, setSameAsSender] = useState(false);
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
    receiverAddress: (state, value) => {
      state.receiverAddress = value;
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
  });

  const onExtraProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtraProductName(e.target.value);
  };

  const onSameAsSenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSameAsSender(e.target.value === "true");
  };

  const isSenderNameValid = order.senderName.length > 0;
  const isSenderPhoneValid = order.senderPhone.length > 0;
  const isReceiverNameValid = order.receiverName.length > 0;
  const isReceiverPhoneValid = order.receiverPhone.length > 0;
  const isReceiverAddressValid = order.receiverAddress.length > 0;
  const isReceiverAddressDetailValid = order.receiverAddressDetail.length > 0;
  const isProductNameValid = order.productName !== "상품을 선택해주세요.";
  const isInitialValid = order.initial.length > 0;
  const isRegistBtnValid =
    isSenderNameValid &&
    isSenderPhoneValid &&
    isReceiverNameValid &&
    isReceiverPhoneValid &&
    isReceiverAddressValid &&
    isReceiverAddressDetailValid &&
    isProductNameValid &&
    isInitialValid;

  return (
    <div className='p-3 m-auto max-w-full'>
      <h1 className='text-3xl text-center py-8 font-bold'>송 장</h1>

      <form action='' onSubmit={(e) => e.preventDefault()}>
        <div className='flex gap-3 justify-evenly flex-wrap items-start'>
          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10 relative'>
            <legend className='text-lg shadow-md rounded-md px-2 py-1' onClick={senderInfo.toggle}>
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

            <div
              className={`absolute top-0 left-0 w-full h-full z-10 backdrop-blur-sm rounded-md overflow-hidden flex flex-col items-center justify-center transition-all ${
                senderInfo.isOn ? "" : "hidden"
              }`}
            >
              <span className='mb-4'>
                실제 송장에는 필요하지 않으나, <br />
                택배사고 발생 시 연락을 위해 <br />
                입력해주세요.
              </span>
              <button className='m-box px-3 py-1 m-hover' onClick={senderInfo.toggle}>
                <FontAwesomeIcon
                  icon={faXmark}
                  width={15}
                  height={15}
                  className='mr-1 opacity-75'
                />
                <span>닫기</span>
              </button>
            </div>

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
              className='m-box px-3 py-1 mb-3 w-full invalid:shake invalid:border-red-300 invalid:border-2'
              defaultValue={order.senderName}
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
              className='m-box px-3 py-1 mb-3 w-full invalid:shake invalid:border-red-300 invalid:border-2'
              value={order.senderPhone}
              onChange={orderActions.onSenderPhoneChange}
              required
            />
          </fieldset>

          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10'>
            <legend className='text-lg shadow-md rounded-md px-2 py-1'>
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
                icon={sameAsSender ? faEquals : faNotEqual}
                width={20}
                height={20}
                className='mr-1 opacity-75'
              />
              <span>보내는 사람과</span>
            </label>
            <select
              name='same-as-sender'
              id='same-as-sender'
              className='m-box px-3 py-1 mb-3 w-full'
              defaultValue='false'
              onChange={onSameAsSenderChange}
            >
              <option value='true'>동일함</option>
              <option value='false'>동일하지 않음</option>
            </select>

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
              className='m-box px-3 py-1 mb-3 w-full invalid:shake invalid:border-red-300 invalid:border-2 disabled:opacity-40'
              value={sameAsSender ? order.senderName : order.receiverName}
              onChange={orderActions.onReceiverNameChange}
              required
              disabled={sameAsSender}
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
              className='m-box px-3 py-1 mb-3 w-full invalid:shake invalid:border-red-300 invalid:border-2 disabled:opacity-40'
              value={sameAsSender ? order.senderPhone : order.receiverPhone}
              onChange={orderActions.onReceiverPhoneChange}
              required
              disabled={sameAsSender}
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
              className='m-box px-3 py-1 mb-3 w-full invalid:shake invalid:border-red-300 invalid:border-2'
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
              className='m-box px-3 py-1 mb-3 w-full invalid:shake invalid:border-red-300 invalid:border-2'
              defaultValue={order.receiverAddressDetail}
              onChange={orderActions.onReceiverAddressDetailChange}
              required
            />
          </fieldset>

          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10 relative'>
            <legend className='text-lg shadow-md rounded-md px-2 py-1'>
              <FontAwesomeIcon
                icon={faBoxesStacked}
                width={18}
                height={18}
                className='mr-2 opacity-75'
              />
              <span>배송물품</span>
            </legend>

            <div
              className={`absolute top-0 left-0 w-full h-full z-10 backdrop-blur-sm rounded-md overflow-hidden flex flex-col items-center justify-center transition-all ${
                productInfo.isOn ? "" : "hidden"
              }`}
            >
              <span className='mb-4'>
                묶음 배송은 10kg까지만 가능합니다. <br />
                배송해야할 상품이 많은 경우, <br />
                송장을 나눠서 작성하셔야합니다. <br />
              </span>
              <button className='m-box px-3 py-1 m-hover' onClick={productInfo.toggle}>
                <FontAwesomeIcon
                  icon={faXmark}
                  width={15}
                  height={15}
                  className='mr-1 opacity-75'
                />
                <span>닫기</span>
              </button>
            </div>

            <div
              className={`absolute top-0 left-0 w-full h-full z-10 backdrop-blur-sm rounded-md overflow-hidden flex flex-col items-center justify-center transition-all ${
                initialInfo.isOn ? "" : "hidden"
              }`}
            >
              <span className='mb-4'>
                다른 손님의 택배와 구분하고, <br />
                오배송을 줄이기 위해, <br />
                박스에 이니셜을 적어주세요. <br />
              </span>
              <button className='m-box px-3 py-1 m-hover' onClick={initialInfo.toggle}>
                <FontAwesomeIcon
                  icon={faXmark}
                  width={15}
                  height={15}
                  className='mr-1 opacity-75'
                />
                <span>닫기</span>
              </button>
            </div>

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
              className={`m-box px-3 py-1 mb-3 w-full ${
                isProductNameValid ? "" : "shake border-red-300 border-2"
              }`}
              defaultValue={order.productName}
              onChange={orderActions.onProductNameChange}
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
                className='m-box px-3 py-1 mb-3 w-full invalid:shake invalid:border-red-300 invalid:border-2'
                defaultValue={extraProductName}
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
              className='m-box px-3 py-1 mb-3 w-full invalid:shake invalid:border-red-300 invalid:border-2'
              defaultValue={order.initial}
              onChange={orderActions.onInitialChange}
              required
            />
            <Image
              src={ImgInitialEx}
              alt='귤 상자에 자신만의 이니셜이 그려져있는 사진'
              className='rounded-md max-w-full'
              width={250}
              height={158}
              placeholder='blur'
            />
          </fieldset>
        </div>

        <div className='mb-10 text-center'>
          <button
            className='m-box py-1 mb-3 w-56 max-w-full disabled:opacity-40'
            disabled={!isRegistBtnValid}
          >
            <FontAwesomeIcon
              icon={faAddressCard}
              width={20}
              height={20}
              className='mr-2 opacity-75'
            />
            <span>송장 등록</span>
          </button>
        </div>
      </form>
    </div>
  );
}
