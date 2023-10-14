"use client";

import { useProductCategory, useUpdateProductCategory } from "@/api/product_categories";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { diff } from "@/extra/utils";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faNotdef,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function Page(props: PageProps<{ categoryId: string }, {}>) {
  const { categoryId } = props.params;

  const router = useRouter();
  const { data: originCategory } = useProductCategory(categoryId);
  const [category, categoryActions] = useTypeSafeReducer(originCategory!, {
    toggleEnabled: (state) => {
      state.enabled = !state.enabled;
    },
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    reset: () => originCategory!,
  });
  const updateItem = useUpdateProductCategory(categoryId, diff(category, originCategory!), {
    onSuccess: () => router.back(),
  });
  const isLoading = updateItem.isLoading;

  const validity = {
    name: category.name !== "",
  };
  const isValid = Object.values(validity).every((v) => v);

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap justify-center bg-base-200 py-2">
        <li>
          {/* 활성화 */}
          <label className="dst-btn-ghost dsy-btn disabled:bg-transparent">
            <FontAwesomeIcon icon={category.enabled ? faEye : faEyeSlash} />{" "}
            {category.enabled ? "보임중" : "숨김중"}
            <input
              type="checkbox"
              name="enabled"
              id="enabled"
              className="dsy-toggle-success dsy-toggle"
              disabled={isLoading}
              checked={category.enabled}
              onChange={categoryActions.toggleEnabled}
            />
          </label>
        </li>

        <li>
          {/* Clear */}
          <button type="button" className="dsy-btn" onClick={categoryActions.reset}>
            <FontAwesomeIcon icon={faNotdef} rotation={90} />
            초기화
          </button>
        </li>

        <li>
          {/* Save */}
          <button
            type="button"
            className="dst-btn-ghost dsy-btn disabled:bg-transparent"
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
                <FontAwesomeIcon icon={faSignature} /> 카테고리 이름을 입력해주세요.&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="name"
              placeholder="제주명품감귤"
              disabled={isLoading}
              value={category.name}
              onChange={categoryActions.onNameChange}
              invalid={!validity.name}
            />
          </div>
        </form>

        <div className="w-80 space-y-4">
          <h3 className="text-gray-400">미리보기</h3>

          <button type="button" className="dsy-btn">
            {category.name || <span className="text-gray-400">명품제주감귤</span>}
          </button>
        </div>
      </div>
    </main>
  );
}
