"use client";

import {
  RawCustomer,
  useCreateCustomer,
  useCustomer,
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/api/customers";
import { ModalProps } from "@/extra/modal";
import { diff, toHyphenPhone } from "@/extra/utils";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBuilding,
  faFloppyDisk,
  faMobileScreen,
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
    <dialog ref={props.ref} className="dsy-modal">
      <form method="dialog" className="dsy-modal-box w-96 bg-opacity-60 backdrop-blur-md">
        <div className="dsy-form-control">
          <label htmlFor="name" className="dsy-label py-1">
            <span className="dsy-label-text">
              <FaIcon icon={faSignature} /> 이름
            </span>
            <Input
              className="w-60"
              id="name"
              placeholder="홍길동"
              value={customer.name}
              onChange={customerActions.onNameChange}
              disabled={isLoading}
              invalid={customer.name === ""}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="phone" className="dsy-label py-1">
            <span className="dsy-label-text">
              <FaIcon icon={faMobileScreen} /> 전화번호
            </span>
            <Input
              className="w-60"
              id="phone"
              type="tel"
              placeholder="010-xxxx-xxxx"
              value={customer.phone}
              onChange={customerActions.onPhoneChange}
              disabled={isLoading}
              invalid={customer.phone === ""}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="receiver-address" className="dsy-label py-1">
            <span className="dsy-label-text">
              <FaIcon icon={faSignsPost} /> 주소
            </span>
            <Input
              className="w-60"
              id="receiver-address"
              placeholder="남원월산로74번길 42"
              disabled={isLoading}
              value={customer.address}
              onChange={postCodePopup.show}
              onClick={postCodePopup.show}
              required
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="receiver-address-detail" className="dsy-label py-1">
            <span className="dsy-label-text">
              <FaIcon icon={faBuilding} /> 상세주소
            </span>
            <Input
              className="w-60"
              id="receiver-address-detail"
              placeholder="단독주택, 1층 101호, ..."
              disabled={isLoading}
              value={customer.addressDetail}
              onChange={customerActions.onAddressDetailChange}
              required
            />
          </label>
        </div>

        <div className="dsy-modal-action">
          {/* Close */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isLoading}
            onClick={props.closeSelf}
          >
            <FaIcon icon={faX} isLoading={isLoading} value="닫기" />
          </button>

          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isCleared || isLoading}
            onClick={customerActions.reset}
          >
            <FaIcon icon={faNotdef} rotation={90} isLoading={isLoading} value="초기화" />
          </button>

          {/* Delete */}
          {mode === "UPDATE" ? (
            <button
              type="button"
              className="dsy-btn-sm dsy-btn"
              disabled={isLoading}
              onClick={() => deleteItem.mutate()}
            >
              <FaIcon icon={faTrashAlt} isLoading={isLoading} value="삭제" />
            </button>
          ) : null}

          {/* Save */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            onClick={mode === "CREATE" ? () => createItem.mutate() : () => updateItem.mutate()}
            disabled={!isValid || isLoading}
          >
            <FaIcon icon={faFloppyDisk} isLoading={isLoading} value="저장" />
          </button>
        </div>
      </form>
    </dialog>
  );
}
