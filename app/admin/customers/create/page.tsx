"use client";

import { RawCustomer, useCreateCustomer } from "@/api/customers";
import { RawProduct, useCreateProduct } from "@/api/products";
import { CheckBox } from "@/components/CheckBox";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faArrowLeft,
  faBoxes,
  faBuilding,
  faCoins,
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faInfinity,
  faMobileScreenButton,
  faNotdef,
  faPaperPlane,
  faSignature,
  faSignsPost,
  faSpinner,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const defaultCustomer: RawCustomer = {
  name: "",
  phone: "",
  address: "",
  addressDetail: "",
};

export default function Page() {
  useAuth();
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const [customer, customerActions] = useTypeSafeReducer(defaultCustomer, {
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    onPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.phone = e.target.value;
    },
    setAddress: (state, address: string) => {
      state.address = address;
    },
    onAddressDetailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.addressDetail = e.target.value;
    },
    reset: (_) => {
      return defaultCustomer;
    },
  });

  const validity = {
    name: customer.name !== "",
    phone: customer.phone !== "",
  };
  const isValid = Object.values(validity).every((v) => v);
  const isCleared = defaultCustomer === customer;

  const createProduct = useCreateCustomer(customer, {
    onSuccess: () => navigate.back(),
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      customerActions.setAddress(data.roadAddress);
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
          disabled={isCleared || createProduct.isLoading}
          onClick={() => customerActions.reset()}
        >
          <FaIcon icon={faNotdef} rotation={90} /> 초기화
        </button>

        {/* Save */}
        <button
          type='button'
          className='m-box px-3 py-2 m-hover disabled:opacity-40'
          disabled={!isValid || createProduct.isLoading}
          onClick={() => createProduct.mutate()}
        >
          {createProduct.isLoading ? (
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
            <legend className='btn text-lg bg-transparent p-2'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 고객정보
            </legend>

            <div className='field'>
              <label htmlFor='name' className='label'>
                <FaIcon icon={faSignature} /> 이름
              </label>
              <Input
                id='name'
                type='text'
                placeholder='홍길동'
                disabled={createProduct.isLoading}
                value={customer.name}
                onChange={customerActions.onNameChange}
                required
                invalid={!validity.name}
              />
            </div>

            <div className='field'>
              <label htmlFor='price' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <Input
                id='price'
                type='text'
                placeholder='010-xxxx-xxxx'
                disabled={createProduct.isLoading}
                value={customer.phone}
                onChange={customerActions.onPhoneChange}
                required
                invalid={!validity.phone}
              />
            </div>

            <div className='field'>
              <label htmlFor='address' className='label'>
                <FaIcon icon={faSignsPost} /> 주소
              </label>
              <Input
                id='address'
                type='text'
                placeholder='제주특별자치도 서귀포시 남원읍 ...'
                disabled={createProduct.isLoading}
                value={customer.address}
                onChange={() => {}}
                onClick={postCodePopup.show}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='address-detail' className='label'>
                <FaIcon icon={faBuilding} /> 상세주소
              </label>
              <Input
                id='address-detail'
                type='text'
                placeholder='apt, 101호 ...'
                disabled={createProduct.isLoading}
                value={customer.addressDetail}
                onChange={() => {}}
                onClick={postCodePopup.show}
                required
              />
            </div>
          </fieldset>
        </div>
      </form>
    </main>
  );
}
