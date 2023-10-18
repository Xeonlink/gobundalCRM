"use client";

import { useCreateCustomer, useCustomer, useUpdateCustomer } from "@/api/customers";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { diff, toHyphenPhone } from "@/extra/utils";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBuilding,
  faFloppyDisk,
  faMobileScreen,
  faNotdef,
  faSignature,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

type Params = { customerId: string };

export default function Page(props: PageProps<Params, {}>) {
  const { customerId } = props.params;

  const router = useRouter();
  const { data: originCustomer } = useCustomer(customerId);
  const [customer, customerActions] = useTypeSafeReducer(originCustomer!, {
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
    reset: () => originCustomer!,
  });
  const updateItem = useUpdateCustomer(customerId, diff(customer, originCustomer!), {
    onSuccess: () => router.back(),
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => customerActions.setAddress(data.address),
  });
  const isLoading = updateItem.isLoading;

  const validity = {
    name: customer.name !== "",
    phone: customer.phone !== "",
    address: customer.address !== "",
    addressDetail: customer.addressDetail !== "",
  };
  const isValid = Object.values(validity).every((v) => v);

  return (
    <main>
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2  max-sm:flex-col">
        <li>
          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            onClick={customerActions.reset}
          >
            <FontAwesomeIcon icon={faNotdef} rotation={90} />
            초기화
          </button>
        </li>

        <li>
          {/* Save */}
          <button
            type="button"
            className="dst-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            disabled={!isValid || isLoading}
            onClick={() => updateItem.mutate()}
          >
            <FontAwesomeIcon icon={faFloppyDisk} /> 저장
          </button>
        </li>
      </ul>

      <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
        <form className="w-[500px] space-y-6 rounded-xl border bg-white px-8 py-6">
          <div className="dsy-form-control">
            <label htmlFor="name" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faSignature} /> 이름&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="name"
              placeholder="홍길동"
              value={customer.name}
              onChange={customerActions.onNameChange}
              disabled={isLoading}
              invalid={customer.name === ""}
              required
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="phone" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faMobileScreen} /> 전화번호&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="010-0000-0000"
              value={customer.phone}
              onChange={customerActions.onPhoneChange}
              disabled={isLoading}
              invalid={customer.phone === ""}
              required
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="receiver-address" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faSignsPost} /> 주소&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="receiver-address"
              placeholder="남원월산로74번길 42"
              disabled={isLoading}
              value={customer.address}
              onChange={postCodePopup.show}
              onClick={postCodePopup.show}
              invalid={customer.address === ""}
              required
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="receiver-address-detail" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faBuilding} /> 상세주소&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="receiver-address-detail"
              placeholder="단독주택, 1층 101호, ..."
              disabled={isLoading}
              value={customer.addressDetail}
              onChange={customerActions.onAddressDetailChange}
              invalid={customer.addressDetail === ""}
              required
            />
          </div>
        </form>
      </div>
    </main>
  );
}
