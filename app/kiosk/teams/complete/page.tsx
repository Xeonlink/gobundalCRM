"use client";

import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";

export default function Page() {
  const [countDown, setCountDown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (countDown < 0) {
      router.back();
      return;
    }

    setTimeout(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
  }, [countDown]);

  return (
    <form>
      <fieldset className="mb-14 flex w-80 max-w-full flex-col rounded-lg bg-white bg-opacity-60 p-6 sm:mt-14">
        <legend className="text-center text-lg font-bold">
          <FontAwesomeIcon icon={faPeopleRoof} /> 팀 등록
        </legend>

        <p className="flex-1 text-center">
          등록이 <strong>완료</strong>되었습니다.
          <br />
          <br />
          장갑과 가위를 챙기고, <br />
          잠시만 기다려주세요.
        </p>

        <div className="dsy-divider"></div>

        <div className="text-center">
          잠시후 이전 화면으로 돌아갑니다.
          <br />
          <span className="dsy-countdown text-xl">
            <span style={{ "--value": countDown } as CSSProperties}></span>
          </span>
        </div>
      </fieldset>
    </form>
  );
}
