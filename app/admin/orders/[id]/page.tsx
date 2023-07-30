"use client";

import { Order, useOrder, useUpdateOrder } from "@/api/orders";
import { useProducts } from "@/api/products";
import { BlurInfo } from "@/components/BlurInfo";
import { CheckBox } from "@/components/CheckBox";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { cls, toHyphenPhone } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
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
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Params = { id: string };
type SearchParams = { date: string };

export default function Page(props: PageProps<Params, SearchParams>) {
  const { params, searchParams } = props;

  useAuth();
  const navigate = useRouter();
  const order = useOrder(params.id);
  const senderInfo = useToggle(false);
  const initialInfo = useToggle(false);
  const productInfo = useToggle(false);
  const sameAsSender = useToggle(false);
  const products = useProducts();
  const [changes, changeActions] = useTypeSafeReducer(
    { sameAsSender: order.data?.sameAsSender } as Partial<Order>,
    {
      onSenderNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === order.data?.senderName) {
          delete state.senderName;
          return;
        }
        state.senderName = e.target.value;
      },
      onSenderPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === order.data?.senderPhone) {
          delete state.senderPhone;
          return;
        }
        state.senderPhone = toHyphenPhone(e.target.value);
      },
      toggleSameAsSender: (state) => {
        state.sameAsSender = !state.sameAsSender;
      },
      onReceiverNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === order.data?.receiverName) {
          delete state.receiverName;
          return;
        }
        state.receiverName = e.target.value;
      },
      onReceiverPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === order.data?.receiverPhone) {
          delete state.receiverPhone;
          return;
        }
        state.receiverPhone = toHyphenPhone(e.target.value);
      },
      setReceiverAddress: (state, receiverAddress: string) => {
        if (receiverAddress === order.data?.receiverAddress) {
          delete state.receiverAddress;
          return;
        }
        state.receiverAddress = receiverAddress;
      },
      onReceiverAddressDetailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === order.data?.receiverAddressDetail) {
          delete state.receiverAddressDetail;
          return;
        }
        state.receiverAddressDetail = e.target.value;
      },
      onProductNameChange: (state, e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === order.data?.productName) {
          delete state.productName;
          return;
        }
        state.productName = e.target.value;
      },
      onMemoChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === order.data?.memo) {
          delete state.memo;
          return;
        }
        state.memo = e.target.value;
      },
      reset: (_) => {
        return {};
      },
    }
  );

  const partialOrder: Partial<Order> = {
    ...order.data,
    ...changes,
  };

  const updateOrder = useUpdateOrder(params.id, partialOrder);

  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      changeActions.setReceiverAddress(data.roadAddress);
    },
  });

  const isCleared = Object.keys(changes).length === 0;

  const validity = {
    senderName: partialOrder.senderName?.length !== 0,
    senderPhone: partialOrder.senderPhone?.length !== 0,
    receiverName: partialOrder.receiverName?.length !== 0,
    receiverPhone: partialOrder.receiverPhone?.length !== 0,
    receiverAddress: partialOrder.receiverAddress?.length !== 0,
    receiverAddressDetail: partialOrder.receiverAddressDetail?.length !== 0,
    productName:
      partialOrder.productName !== null && partialOrder.productName !== "상품을 선택해주세요.",
  };
  const isRegistBtnValid = Object.values(validity).every((v) => v) && !isCleared;

  return (
    <main className='p-3 h-full flex-1 overflow-auto'>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <button type='button' className='btn px-3 py-2' onClick={navigate.back}>
          <FaIcon icon={faArrowLeft} /> 뒤로가기
        </button>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Clear */}
        <button
          type='button'
          className='btn px-3 py-2'
          disabled={isCleared}
          onClick={changeActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} /> 초기화
        </button>

        {/* Save */}
        <button
          type='button'
          className='btn px-3 py-2'
          disabled={!isRegistBtnValid || updateOrder.isLoading}
          onClick={() => updateOrder.mutate()}
        >
          <FaIcon icon={faFloppyDisk} /> 저장
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
              <input
                id='sender-name'
                type='text'
                placeholder='홍길동'
                className='input'
                disabled={updateOrder.isLoading}
                value={partialOrder.senderName}
                onChange={changeActions.onSenderNameChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='sender-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <input
                id='sender-phone'
                type='tel'
                placeholder='010-xxxx-xxxx'
                className='input'
                disabled={updateOrder.isLoading}
                value={partialOrder.senderPhone}
                onChange={changeActions.onSenderPhoneChange}
                required
              />
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
                checked={partialOrder.sameAsSender || false}
                disable={updateOrder.isLoading}
                toggleFn={changeActions.toggleSameAsSender}
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
                disabled={sameAsSender.isOn || updateOrder.isLoading}
                value={sameAsSender.isOn ? partialOrder.senderName : partialOrder.receiverName}
                onChange={changeActions.onReceiverNameChange}
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
                disabled={sameAsSender.isOn || updateOrder.isLoading}
                value={sameAsSender.isOn ? partialOrder.senderPhone : partialOrder.receiverPhone}
                onChange={changeActions.onReceiverPhoneChange}
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
                disabled={updateOrder.isLoading}
                value={partialOrder.receiverAddress}
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
                disabled={updateOrder.isLoading}
                value={partialOrder.receiverAddressDetail}
                onChange={changeActions.onReceiverAddressDetailChange}
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
                disabled={updateOrder.isLoading}
                value={partialOrder.productName}
                onChange={changeActions.onProductNameChange}
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
              <label id='memo' className='btn label bg-transparent shadow-none text-start'>
                <FaIcon icon={faSignature} /> 메모 <FaIcon icon={faCircleQuestion} />
              </label>
              <Input
                id='memo'
                type='text'
                disabled={updateOrder.isLoading}
                value={partialOrder.memo}
                onChange={changeActions.onMemoChange}
                required
              />
            </div>
          </fieldset>
        </div>
      </form>
    </main>
  );
}
