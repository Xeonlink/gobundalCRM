"use client";

import { PageProps } from "@/extra/type";
import IcoLogo from "@/public/icons/logo_transparent.png";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function Page(_: PageProps) {
  return (
    <main className="m-auto h-full min-h-screen">
      <div className="mb-20">
        <div>
          <Image
            src={IcoLogo}
            alt="gobundal-logo"
            width={250}
            height={250}
            placeholder="blur"
            className="m-auto my-8"
          />
        </div>

        <h1 className="w-full py-3 text-center font-bold">쿠폰을 구매하셨나요?</h1>

        <div className="mb-2 grid w-full grid-cols-[repeat(auto-fill,_200px)] place-items-center justify-center">
          <div className="dsy-form-control w-fit text-center">
            <label htmlFor="coupon1" className="dsy-label">
              <input
                type="radio"
                name="coupon"
                id="coupon1"
                className="dsy-radio dsy-radio-sm mr-2"
              />
              <span className="dsy-label-text">dfasdfs</span>
            </label>
          </div>
          <div className="dsy-form-control w-fit text-center">
            <label htmlFor="coupon1" className="dsy-label">
              <input
                type="radio"
                name="coupon"
                id="coupon1"
                className="dsy-radio dsy-radio-sm mr-2"
              />
              <span className="dsy-label-text">dfasdfs</span>
            </label>
          </div>
          <div className="dsy-form-control w-fit text-center">
            <label htmlFor="coupon2" className="dsy-label">
              <input
                type="radio"
                name="coupon"
                id="coupon2"
                className="dsy-radio dsy-radio-sm mr-2"
              />
              <span className="dsy-label-text">dfasdfs</span>
            </label>
          </div>
          <div className="dsy-form-control w-fit text-center">
            <label htmlFor="coupon3" className="dsy-label">
              <input
                type="radio"
                name="coupon"
                id="coupon3"
                className="dsy-radio dsy-radio-sm mr-2"
              />
              <span className="dsy-label-text">dfasdfs</span>
            </label>
          </div>
          <div className="dsy-form-control w-fit text-center">
            <label htmlFor="coupon4" className="dsy-label">
              <input
                type="radio"
                name="coupon"
                id="coupon4"
                className="dsy-radio dsy-radio-sm mr-2"
              />
              <span className="dsy-label-text">dfasdfs</span>
            </label>
          </div>
          <div className="dsy-form-control w-fit text-center">
            <label htmlFor="coupon5" className="dsy-label">
              <input
                type="radio"
                name="coupon"
                id="coupon5"
                className="dsy-radio dsy-radio-sm mr-2"
              />
              <span className="dsy-label-text">dfasdfs</span>
            </label>
          </div>
          <div className="dsy-form-control w-fit text-center">
            <label htmlFor="coupon6" className="dsy-label">
              <input
                type="radio"
                name="coupon"
                id="coupon6"
                className="dsy-radio dsy-radio-sm mr-2"
              />
              <span className="dsy-label-text">dfasdfs</span>
            </label>
          </div>
          <div className="dsy-form-control w-fit text-center">
            <label htmlFor="coupon7" className="dsy-label">
              <input
                type="radio"
                name="coupon"
                id="coupon7"
                className="dsy-radio dsy-radio-sm mr-2"
              />
              <span className="dsy-label-text">dfasdfs</span>
            </label>
          </div>
        </div>
      </div>

      <div className="dsy-join fixed bottom-0 w-full text-center">
        <button type="button" className="dsy-join-item dsy-btn w-1/2 rounded-none border-none">
          <FaIcon icon={faLeftLong} /> 이전
        </button>
        <button
          type="button"
          className="dsy-join-item dsy-btn w-1/2 rounded-none border-none bg-orange-300"
        >
          다음 <FaIcon icon={faRightLong} />
        </button>
      </div>
    </main>
  );
}
