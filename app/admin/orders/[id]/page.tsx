"use client";

import { Order, getOrder, updateOrder } from "@/api/orders";
import { BlurInfo } from "@/components/BlurInfo";
import { CheckBox } from "@/components/CheckBox";
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
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
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
          <FaIcon icon={faArrowLeft} width={22} height={22} />
          &nbsp; 뒤로가기
        </button>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Clear */}
        <button type='button' className='btn px-3 py-2' disabled={isCleared} onClick={clearForm}>
          <FaIcon icon={faNotdef} width={22} height={22} rotation={90} />
          &nbsp; 초기화
        </button>

        {/* Save */}
        <button
          type='button'
          className='btn px-3 py-2'
          disabled={!isRegistBtnValid || updateOrderReq.isLoading}
          onClick={() => updateOrderReq.mutate()}
        >
          <FaIcon icon={faFloppyDisk} width={22} height={22} />
          &nbsp; 저장
        </button>
      </div>

      {/* Form */}
      <form action='' onSubmit={(e) => e.preventDefault()}>
        <div className='flex gap-3 justify-evenly flex-wrap items-start'>
          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10 relative'>
            <legend className='btn text-lg bg-transparent px-2 py-2' onClick={senderInfo.toggle}>
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
                disabled={updateOrderReq.isLoading}
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
                disabled={updateOrderReq.isLoading}
                value={partialOrder.senderPhone}
                onChange={changeActions.onSenderPhoneChange}
                required
              />
            </div>
          </fieldset>

          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10'>
            <legend className='text-lg m-box p-2 text-center bg-transparent'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 받는 사람
            </legend>

            <div className='field'>
              <label htmlFor='same-as-sender' className='label'>
                <FaIcon icon={faPaperPlane} /> 보내는 사람과
              </label>
              <div
                className='flex gap-3 disabled:opacity-40 mb-3'
                aria-disabled={updateOrderReq.isLoading}
              >
                <button
                  type='button'
                  className='btn w-full shadow-none p-2'
                  disabled={sameAsSender.isOn}
                  onClick={sameAsSender.toggle}
                >
                  <FaIcon icon={faEquals} /> 동일
                </button>
                <button
                  type='button'
                  className='btn w-full shadow-none p-2'
                  disabled={!sameAsSender.isOn}
                  onClick={sameAsSender.toggle}
                >
                  <FaIcon icon={faNotEqual} /> 동일하지 않음
                </button>
              </div>
            </div>

            <div className='field'>
              <label htmlFor='receiver-name' className='label'>
                <FaIcon icon={faSignature} /> 이름
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
            </div>

            <div className='field'>
              <label htmlFor='receiver-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
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
            </div>

            <div className='field'>
              <label htmlFor='receiver-address' className='label'>
                <FaIcon icon={faSignsPost} /> 주소
              </label>
              <input
                id='receiver-address'
                type='text'
                placeholder='남원월산로74번길 42'
                className='input'
                disabled={updateOrderReq.isLoading}
                value={partialOrder.receiverAddress}
                onChange={() => {}}
                onClick={postCodePopup.show}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-address-detail' className='label'>
                <FaIcon icon={faBuilding} /> 상세주소
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
            </div>
          </fieldset>

          <fieldset className='w-80 shadow-md rounded-md p-3 mb-10 relative'>
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
            </div>

            <div className='field'>
              <label
                className='btn label bg-transparent shadow-none text-start'
                onClick={initialInfo.toggle}
              >
                <FaIcon icon={faSignature} /> 이니셜 <FaIcon icon={faCircleQuestion} />
              </label>
              <input
                id='initial'
                type='text'
                placeholder='HGD, love you, 하트모양, ...'
                className='input mb-2'
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
            </div>
          </fieldset>
        </div>
      </form>
    </main>
  );
}
