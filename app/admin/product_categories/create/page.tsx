"use client";

import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import {
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faNotdef,
  faQuoteLeft,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { createProductCategory } from "./actions";

export default function Page() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onReset = () => {
    setName("");
    setDescription("");
  };

  return (
    <main className="min-h-screen">
      <form action={createProductCategory} onReset={onReset}>
        {/* Toolbar */}
        <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
          <li>
            {/* 활성화 */}
            <label className="dsy-btn-ghost dsy-btn disabled:bg-transparent">
              <FontAwesomeIcon icon={faEyeSlash} /> 비활성화
              <input
                id="enabled"
                type="checkbox"
                name="enabled"
                className="dsy-toggle-success dsy-toggle"
                title="활성화"
              />
              활성화 <FontAwesomeIcon icon={faEye} />
            </label>
          </li>

          <li>
            {/* Clear */}
            <button
              type="reset"
              className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
            >
              <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
            </button>
          </li>

          <li>
            {/* Save */}
            <Link
              href={{ pathname: "./preview", query: { name, description } }}
              className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
              scroll={false}
            >
              <FontAwesomeIcon icon={faEye} /> 미리보기
            </Link>
          </li>

          <li>
            {/* Save */}
            <button className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none">
              <FontAwesomeIcon icon={faFloppyDisk} /> 저장
            </button>
          </li>
        </ul>

        <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
          <div className="w-[500px] space-y-6 rounded-xl border bg-white px-8 py-6">
            <div className="dsy-form-control">
              <label htmlFor="name" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faSignature} /> 이름&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="name"
                type="text"
                name="name"
                required
                title="카테고리 이름"
                placeholder="명품제주감귤"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="description" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faQuoteLeft} /> 설명
                </strong>
              </label>
              <SelfValidateInput
                id="description"
                type="text"
                name="description"
                title="카테고리 설명"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="w-80 space-y-4">
            <h3 className="text-gray-400">미리보기</h3>

            <button type="button" className="dsy-btn" title={description}>
              {name || <span className="text-gray-400">명품제주감귤</span>}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
