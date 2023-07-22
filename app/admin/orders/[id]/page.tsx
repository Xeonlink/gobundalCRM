"use client";

import { Order, RawOrder, getOrder, postOrder, updateOrder } from "@/api/orders";
import { BlurInfo } from "@/components/BlurInfo";
import { CheckBox } from "@/components/CheckBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageProps } from "@/extra/type";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Params = { id: string };
type SearchParams = { date: string };

export default function OrdersCreatePage(props: PageProps<Params, SearchParams>) {
  const {
    params: { id },
    searchParams: { date },
  } = props;
  const navigate = useRouter();
  const senderInfo = useToggle(false);
  const initialInfo = useToggle(false);
  const productInfo = useToggle(false);
  const sameAsSender = useToggle(false);

  const [extraProductName, setExtraProductName] = useState("");
  const [changes, changeActions] = useTypeSafeReducer({} as Partial<Order>, {
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
      return {};
    },
  });

  const order = useQuery({
    queryKey: ["orders", date, id],
    queryFn: () => getOrder(date, id),
    suspense: true,
  });

  const partialOrder: Partial<Order> = {
    ...order.data,
    ...changes,
  };

  const updateOrderReq = useMutation({
    mutationFn: () => updateOrder(date, id, partialOrder),
  });

  const onExtraProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtraProductName(e.target.value);
  };

  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      changeActions.setReceiverAddress(data.roadAddress);
    },
  });

  const clearForm = () => {
    changeActions.reset();
  };

  const clearity = {
    senderName: partialOrder.senderName === order.data?.senderName,
    senderPhone: partialOrder.senderPhone === order.data?.senderPhone,
    receiverName: partialOrder.receiverName === order.data?.receiverName,
    receiverPhone: partialOrder.receiverPhone === order.data?.receiverPhone,
    receiverAddress: partialOrder.receiverAddress === order.data?.receiverAddress,
    receiverAddressDetail: partialOrder.receiverAddressDetail === order.data?.receiverAddressDetail,
    productName: partialOrder.productName === order.data?.productName,
    initial: partialOrder.initial === order.data?.initial,
  };
  const isCleared = Object.values(clearity).every((v) => v);

  const validity = {
    senderName: partialOrder.senderName?.length !== 0,
    senderPhone: partialOrder.senderPhone?.length !== 0,
    receiverName: partialOrder.receiverName?.length !== 0,
    receiverPhone: partialOrder.receiverPhone?.length !== 0,
    receiverAddress: partialOrder.receiverAddress?.length !== 0,
    receiverAddressDetail: partialOrder.receiverAddressDetail?.length !== 0,
    productName:
      partialOrder.productName !== null && partialOrder.productName !== "상품을 선택해주세요.",
    initial: partialOrder.initial?.length !== 0,
  };
  const isRegistBtnValid = Object.values(validity).every((v) => v) && !isCleared;

  return (
    <main className='p-3'>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <button type='button' className='btn px-3 py-2' onClick={navigate.back}>
          <FontAwesomeIcon icon={faArrowLeft} width={22} height={22} />
          &nbsp; 뒤로가기
        </button>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Clear */}
        <button type='button' className='btn px-3 py-2' disabled={isCleared} onClick={clearForm}>
          <FontAwesomeIcon icon={faNotdef} width={22} height={22} rotation={90} />
          &nbsp; 초기화
        </button>

        {/* Save */}
        <button
          type='button'
          className='btn px-3 py-2'
          disabled={!isRegistBtnValid || updateOrderReq.isLoading}
          onClick={() => updateOrderReq.mutate()}
        >
          <FontAwesomeIcon icon={faFloppyDisk} width={22} height={22} />
          &nbsp; 저장
        </button>
      </div>

      {/* Form */}
      <form action='' onSubmit={(e) => e.preventDefault()}>
        <div className='flex gap-3 justify-evenly flex-wrap items-start'>
          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10 relative'>
            <legend className='btn text-lg px-2 py-2 bg-transparent' onClick={senderInfo.toggle}>
              <FontAwesomeIcon icon={faPaperPlane} staticSize={15} className='mr-2 opacity-75' />
              <span>보내는 사람</span>
              <FontAwesomeIcon
                icon={faCircleQuestion}
                staticSize={16}
                className='ml-2 opacity-75'
              />
            </legend>

            <BlurInfo open={senderInfo.isOn} closeFn={senderInfo.toggle}>
              실제 배송정보에는 필요하지 않으나, <br />
              택배사고 발생 시 연락을 위해 <br />
              입력해주세요.
            </BlurInfo>

            <label htmlFor='sender-name' className='block mb-1 pl-2'>
              <FontAwesomeIcon icon={faSignature} staticSize={20} className='mr-1 opacity-75' />
              <span>이름</span>
            </label>
            <input
              id='sender-name'
              type='text'
              placeholder='홍길동'
              className='rounded-md px-3 py-2 mb-3 w-full input-invalid disabled:opacity-40'
              disabled={updateOrderReq.isLoading}
              value={partialOrder.senderName}
              onChange={changeActions.onSenderNameChange}
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
              disabled={updateOrderReq.isLoading}
              value={partialOrder.senderPhone}
              onChange={changeActions.onSenderPhoneChange}
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
              aria-diabled={updateOrderReq.isLoading}
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
              disabled={sameAsSender.isOn || updateOrderReq.isLoading}
              value={sameAsSender.isOn ? partialOrder.senderName : partialOrder.receiverName}
              onChange={changeActions.onReceiverNameChange}
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
              disabled={sameAsSender.isOn || updateOrderReq.isLoading}
              value={sameAsSender.isOn ? partialOrder.senderPhone : partialOrder.receiverPhone}
              onChange={changeActions.onReceiverPhoneChange}
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
              disabled={updateOrderReq.isLoading}
              value={partialOrder.receiverAddress}
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
              disabled={updateOrderReq.isLoading}
              value={partialOrder.receiverAddressDetail}
              onChange={changeActions.onReceiverAddressDetailChange}
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
              disabled={updateOrderReq.isLoading}
              value={partialOrder.productName}
              onChange={changeActions.onProductNameChange}
              required
            >
              <option value='상품을 선택해주세요.'>상품을 선택해주세요.</option>
              <option value='체험귤 5kg'>체험귤 5kg</option>
              <option value='체험귤 10kg'>체험귤 10kg</option>
              <option value='체험귤 5kg x 2'>체험귤 5kg x 2</option>
              <option value='기타'>기타</option>
            </select>
            {partialOrder.productName === "기타" ? (
              <input
                id='product-name'
                type='text'
                placeholder='귤5kg, 귤10kg, 귤5kg x 2, ...'
                className='input'
                disabled={updateOrderReq.isLoading}
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
              disabled={updateOrderReq.isLoading}
              value={partialOrder.initial}
              onChange={changeActions.onInitialChange}
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
