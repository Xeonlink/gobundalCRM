"use client";

import { useUpdateUserAttributes, useUserAttributes } from "@/api/auth";
import { Input } from "@/components/Input";
import { toHyphenPhone } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import ImgNoImg from "@/public/images/no_image.png";
import { faFloppyDisk, faNotdef } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";

export default function Page() {
  const auth = useAuth();
  const originAttr = useUserAttributes(auth.user, {
    enabled: !!window.document,
  });
  console.log(originAttr.data);

  const [attr, attrActions] = useTypeSafeReducer(originAttr.data!, {
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    onNickNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.nickname = e.target.value;
    },
    onBirthdayChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.birthday = e.target.value;
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
    reset: () => originAttr.data!,
  });

  console.log(attr);

  const postCodePopup = usePostCodePopup({
    onComplete: (data) => attrActions.setAddress(data.address),
  });
  const updateItem = useUpdateUserAttributes(attr);
  const isLoading = updateItem.isLoading;

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2  max-sm:flex-col">
        <li>
          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            onClick={attrActions.reset}
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
            disabled={isLoading}
            onClick={() => updateItem.mutate()}
          >
            <FontAwesomeIcon icon={faFloppyDisk} /> 저장
          </button>
        </li>
      </ul>

      <div className="container m-auto">
        <div className="w-72 rounded-md bg-white p-6 text-center shadow-md">
          <Image src={ImgNoImg} alt="logo" className="inline-block w-1/2" />
          <br />
          <span>{}</span>
          <br />
        </div>

        <button type="button" className="dsy-btn bg-white" onClick={() => originAttr.refetch()}>
          refetch
        </button>
      </div>

      {/* 나의 연락처 */}
      <section className="container m-auto mt-6 max-w-4xl px-2">
        <h3 className="flex items-center p-2">
          <span className="text-md flex-1 font-bold">나의 프로필 (선택)</span>
        </h3>

        <table className="grid grid-cols-[repeat(2,auto)] overflow-hidden rounded-md border text-sm sm:grid-cols-[repeat(3,auto)_1fr]">
          <tbody className="contents">
            <tr className="contents">
              <td className="flex items-center rounded-tl-md border-b bg-base-200 p-2 sm:w-32">
                이름
              </td>
              <td className="flex-1 rounded-tr-md border-b p-2">
                <Input
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={attr.name || ""}
                  onChange={attrActions.onNameChange}
                  placeholder="홍길동"
                  disabled={isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center border-b bg-base-200 p-2 sm:w-32 sm:justify-center">
                별명
              </td>
              <td className="flex-1 border-b p-2">
                <Input
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={attr.nickname}
                  onChange={attrActions.onNickNameChange}
                  placeholder="동서에번쩍"
                  disabled={isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center border-b bg-base-200 p-2 sm:w-32">생년월일</td>
              <td className="flex-1 border-b p-2 sm:col-span-3">
                <Input
                  type="date"
                  pattern="\d{4}-\d{2}-\d{2}"
                  max={dayjs().subtract(10, "year").format("YYYY-MM-DD")}
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={attr.birthday}
                  onChange={attrActions.onBirthdayChange}
                  disabled={isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center border-b bg-base-200 p-2 sm:w-32">핸드폰번호</td>
              <td className="flex-1 border-b p-2 sm:col-span-3">
                <Input
                  type="tel"
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={attr.phone}
                  onChange={attrActions.onPhoneChange}
                  placeholder="010-0000-0000"
                  disabled={isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center bg-base-200 p-2 max-sm:border-b sm:w-32">주소</td>
              <td className="flex-1 p-2 max-sm:border-b">
                <Input
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={attr.address}
                  onChange={postCodePopup.show}
                  onClick={postCodePopup.show}
                  placeholder="남원월산로74번길 42"
                  disabled={isLoading}
                />
              </td>
            </tr>
            <tr className="contents">
              <td className="flex items-center bg-base-200 p-2 sm:w-32 sm:justify-center">
                상세주소
              </td>
              <td className="flex-1 p-2">
                <Input
                  className="dsy-input-sm w-full max-w-[182px] text-center"
                  value={attr.addressDetail}
                  onChange={attrActions.onAddressDetailChange}
                  placeholder="단독주택"
                  disabled={isLoading}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
