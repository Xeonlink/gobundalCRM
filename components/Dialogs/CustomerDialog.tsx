"use client";

import {
  RawCustomer,
  useCreateCustomer,
  useCustomer,
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/api/customers";
import { ModalProps } from "@/extra/type";
import { diff, toHyphenPhone } from "@/extra/utils";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBuilding,
  faFloppyDisk,
  faMobileScreenButton,
  faNotdef,
  faPeopleGroup,
  faSignature,
  faSignsPost,
  faTrashAlt,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { FaIcon } from "../FaIcon";
import { Input } from "../Input";

const defaultCustomer: RawCustomer = {
  name: "",
  phone: "",
  address: "",
  addressDetail: "",
};

type Props = ModalProps<{ mode: "CREATE" } | { mode: "UPDATE"; customerId: string }>;

export function CustomerDialog(props: Props) {
  const { mode } = props;

  const { data: originCustomer } = useCustomer(mode === "UPDATE" ? props.customerId : "", {
    enabled: mode === "UPDATE",
  });
  const [customer, customerActions] = useTypeSafeReducer(originCustomer || defaultCustomer, {
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    onPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.phone = toHyphenPhone(e.target.value);
    },
    setAddress: (state, address: string) => {
      state.address = address;
    },
    onAddressDetailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.addressDetail = e.target.value;
    },
    reset: () => (mode === "CREATE" ? defaultCustomer : originCustomer!),
  });
  const createItem = useCreateCustomer(customer, {
    onSuccess: () => props.closeSelf?.(),
  });
  const updateItem = useUpdateCustomer(originCustomer?.id!, diff(customer, originCustomer!), {
    onSuccess: () => props.closeSelf?.(),
  });
  const deleteItem = useDeleteCustomer(originCustomer?.id!, {
    onSuccess: () => props.closeSelf?.(),
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => customerActions.setAddress(data.address),
  });

  const validity = {
    name: customer.name !== "",
    phone: customer.phone !== "",
    address: customer.address !== "",
    addressDetail: customer.addressDetail !== "",
  };
  const isValid = Object.values(validity).every((v) => v);
  const isCleared = mode === "CREATE" ? customer === defaultCustomer : originCustomer === customer;
  const isLoading = createItem.isLoading || updateItem.isLoading || deleteItem.isLoading;

  return (
    <dialog
      ref={props.ref}
      onClose={props.closeSelf}
      className='max-w-full max-h-full rounded-md p-0 w-96 bg-transparent backdrop:backdrop-blur-md animate-scaleTo1'
    >
      <fieldset className='fieldset'>
        <legend className='legend'>
          <FaIcon icon={faPeopleGroup} fontSize={16} /> 고객 정보
        </legend>

        <div className='field'>
          <label htmlFor='name' className='label'>
            <FaIcon icon={faSignature} /> 이름
          </label>
          <Input
            id='name'
            placeholder='홍길동'
            value={customer.name}
            onChange={customerActions.onNameChange}
            disabled={isLoading}
            invalid={customer.name === ""}
          />
        </div>

        <div className='field'>
          <label htmlFor='phone' className='label'>
            <FaIcon icon={faMobileScreenButton} /> 전화번호
          </label>
          <Input
            id='phone'
            type='tel'
            placeholder='010-xxxx-xxxx'
            value={customer.phone}
            onChange={customerActions.onPhoneChange}
            disabled={isLoading}
            invalid={customer.phone === ""}
          />
        </div>

        <div className='field'>
          <label htmlFor='receiver-address' className='label'>
            <FaIcon icon={faSignsPost} /> 주소
          </label>
          <Input
            id='receiver-address'
            placeholder='남원월산로74번길 42'
            disabled={isLoading}
            value={customer.address}
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
            placeholder='단독주택, 1층 101호, ...'
            disabled={isLoading}
            value={customer.addressDetail}
            onChange={customerActions.onAddressDetailChange}
            required
          />
        </div>
      </fieldset>

      <form method='dialog' className='flex justify-end gap-2 mt-2'>
        {/* Close */}
        <button className='btn' disabled={isLoading}>
          <FaIcon icon={faX} isLoading={isLoading} value='닫기' />
        </button>

        {/* Clear */}
        <button
          type='button'
          className='btn'
          disabled={isCleared || isLoading}
          onClick={customerActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} isLoading={isLoading} value='초기화' />
        </button>

        {/* Delete */}
        {mode === "UPDATE" ? (
          <button
            type='button'
            className='btn'
            disabled={isLoading}
            onClick={() => deleteItem.mutate()}
          >
            <FaIcon icon={faTrashAlt} isLoading={isLoading} value='삭제' />
          </button>
        ) : null}

        {/* Save */}
        <button
          type='button'
          className='btn'
          onClick={mode === "CREATE" ? () => createItem.mutate() : () => updateItem.mutate()}
          disabled={!isValid || isLoading}
        >
          <FaIcon icon={faFloppyDisk} isLoading={isLoading} value='저장' />
        </button>
      </form>
    </dialog>
  );
}
