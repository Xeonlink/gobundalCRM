"use client";

import { ErrorProps } from "@/extra/type";
import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, useEffect, useState } from "react";

export default function Error(props: ErrorProps) {
  const [countDown, setCountDown] = useState(10);

  useEffect(() => {
    if (countDown < 0) {
      props.reset();
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

        <h3 className="text-center font-bold">{props.error.name}</h3>

        <p className="flex-1 text-center">{props.error.message}</p>

        <div className="dsy-divider"></div>

        <p className="text-center">
          예상하지 못한 에러가 발생했습니다.
          <br />
          잠시후 다시 시도해주세요.
          <br />
          <span className="dsy-countdown text-xl">
            <span style={{ "--value": countDown } as CSSProperties}></span>
          </span>
        </p>
      </fieldset>
    </form>
  );
}
