"use client";

import { DialogOpener } from "@/components/DialogOpener";
import { SelfValidateInput } from "@/components/Input/SelfValidateInput";
import { ProductPrice } from "@/components/ProductCard/ProductPrice";
import { ProductRegularPrice } from "@/components/ProductCard/ProductRegularPrice";
import { ProductSalePercentage } from "@/components/ProductCard/ProductSalePercentage";
import { useSimpleServerAction } from "@/hooks/useSimpleServerAction";
import ImgNoImg from "@/public/images/no_image.png";
import {
  faBoxes,
  faCartPlus,
  faCreditCard,
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faHandshake,
  faHandshakeSlash,
  faImage,
  faInfinity,
  faNotdef,
  faSignature,
  faStar,
  faTableCellsLarge,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { cache, use, useState } from "react";
import ImageSelector from "../ImageSelector";
import { createProduct, getProductCategories } from "./actions";

type ImageRequired = { id: number; src: string; width: number; height: number };

const getProductCategoriesCached = cache(getProductCategories);

export default function Page() {
  const productCategories = use(getProductCategoriesCached());
  const [images, setImages] = useState<ImageRequired[]>([]);
  const [name, setName] = useState("");
  const [isSale, setIsSale] = useState(false);
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [remain, setRemain] = useState(1);

  const onReset = () => {
    setName("");
    setIsSale(false);
    setPrice(0);
    setSalePrice(0);
    setRemain(1);
  };

  const [isPending, runAction] = useSimpleServerAction(createProduct);

  return (
    <main className="min-h-screen">
      <form onReset={onReset} action={runAction}>
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
                disabled={isPending}
              />
              활성화 <FontAwesomeIcon icon={faEye} />
            </label>
          </li>

          <li>
            {/* 할인여부 */}
            <label className="dsy-btn-ghost dsy-btn disabled:bg-transparent">
              <FontAwesomeIcon icon={faHandshakeSlash} /> 정가
              <input
                id="is-sale"
                type="checkbox"
                name="isSale"
                className="dsy-toggle-success dsy-toggle"
                onChange={(e) => setIsSale(e.target.checked)}
                disabled={isPending}
              />
              할인 <FontAwesomeIcon icon={faHandshake} />
            </label>
          </li>

          <li>
            {/* 재고무한여부 */}
            <label className="dsy-btn-ghost dsy-btn disabled:bg-transparent">
              <FontAwesomeIcon icon={faBoxes} /> 유한재고
              <input
                id="is-remain-infinite"
                type="checkbox"
                name="isRemainInfinite"
                className="dsy-toggle-success dsy-toggle"
                disabled={isPending}
              />
              무한재고 <FontAwesomeIcon icon={faInfinity} />
            </label>
          </li>

          <li>
            {/* 추천상품여부 */}
            <label className="dsy-btn-ghost dsy-btn disabled:bg-transparent">
              <FontAwesomeIcon icon={faStar} /> 추천상품
              <input
                id="is-recommended"
                type="checkbox"
                name="isRecommended"
                className="dsy-toggle-success dsy-toggle"
                disabled={isPending}
              />
            </label>
          </li>

          <li>
            {/* Clear */}
            <button
              type="reset"
              className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
              disabled={isPending}
            >
              <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
            </button>
          </li>

          <li>
            {/* Save */}
            <button
              className="dsy-btn-ghost dsy-btn disabled:bg-transparent max-sm:w-full max-sm:rounded-none"
              disabled={isPending}
            >
              <FontAwesomeIcon icon={faFloppyDisk} /> 저장
            </button>
          </li>
        </ul>

        <div className="m-auto flex flex-wrap items-start justify-center gap-6 py-6 max-sm:px-6">
          <div className="w-[500px] space-y-6 rounded-xl border bg-white px-8 py-6">
            <div className="dsy-form-control">
              <label htmlFor="name" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faSignature} /> 상품명을 입력해주세요.&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <SelfValidateInput
                id="name"
                name="name"
                placeholder="한라봉청 3kg"
                required
                title="상품명"
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="dsy-form-control">
              <label htmlFor="imageIds" className="dsy-label">
                <strong className="dsy-label-text">
                  사진을 추가해 보세요.&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <ol className="flex flex-wrap items-center gap-2">
                {images.map((item, index) => (
                  <li
                    key={item.id}
                    className="relative h-28 w-fit overflow-hidden rounded-md shadow-md"
                  >
                    <Image
                      src={item.src}
                      width={item.width}
                      height={item.height}
                      alt="상품이미지"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="dsy-btn dsy-btn-sm absolute right-0 top-0 rounded-none rounded-bl-md border-none bg-white"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                    >
                      x
                    </button>
                    <input type="hidden" name="imageIds" value={item.id} />
                  </li>
                ))}
                <li>
                  <DialogOpener
                    target="#image-selector"
                    className="dsy-btn h-28 w-28 flex-col rounded-lg bg-transparent"
                  >
                    <FontAwesomeIcon icon={faImage} />
                    <span className="text-sm">사진추가</span>
                  </DialogOpener>
                </li>
              </ol>
            </div>

            <div className="dsy-form-control">
              <label htmlFor="category" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faTableCellsLarge} /> 카테고리&nbsp;
                </strong>
              </label>
              <select
                id="category"
                name="category"
                className="dsy-select-bordered dsy-select w-full"
                title="상품 카테고리"
                disabled={isPending}
              >
                {productCategories!.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="dsy-form-control">
              <label htmlFor="price" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faWon} /> 상품가격&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <div className="relative">
                <SelfValidateInput
                  id="price"
                  type="text"
                  name="price"
                  placeholder="10,000"
                  required
                  title="상품가격"
                  value={price.toLocaleString()}
                  className="w-full"
                  onChange={(e) => setPrice(+e.target.value.replaceAll(",", ""))}
                  disabled={isPending}
                />
                <div className="absolute bottom-1/2 right-4 translate-y-1/2">원</div>
              </div>
            </div>

            <div className="dsy-form-control">
              <label htmlFor="sale-price" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faWon} /> 할인가격&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <div className="relative">
                <SelfValidateInput
                  id="sale-price"
                  type="text"
                  name="salePrice"
                  placeholder="10,000"
                  required
                  className="w-full"
                  value={salePrice.toLocaleString()}
                  onChange={(e) => setSalePrice(+e.target.value.replaceAll(",", ""))}
                  disabled={isPending}
                />
                <div className="absolute bottom-1/2 right-4 translate-y-1/2">원</div>
              </div>
            </div>

            <div className="dsy-form-control">
              <label htmlFor="remain" className="dsy-label">
                <strong className="dsy-label-text">
                  <FontAwesomeIcon icon={faBoxes} /> 재고&nbsp;
                  <span className="align-top text-xs text-orange-500">* 필수</span>
                </strong>
              </label>
              <div className="relative">
                <SelfValidateInput
                  id="remain"
                  type="text"
                  name="remain"
                  placeholder="10,000"
                  value={remain.toLocaleString()}
                  onChange={(e) => setRemain(+e.target.value.replaceAll(",", ""))}
                  required
                  className="w-full"
                  disabled={isPending}
                />
                <div className="absolute bottom-1/2 right-4 translate-y-1/2">개</div>
              </div>
            </div>
          </div>

          <div className="w-80 space-y-4">
            <h3 className="text-gray-400">미리보기</h3>

            <div className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40 transition-all duration-300">
              <figure>
                <Image
                  src={images[0]?.src ?? ImgNoImg}
                  width={images[0]?.width}
                  height={images[0]?.height}
                  alt={name}
                  className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105"
                />
              </figure>
              <div className="dsy-card-body gap-0">
                <span className="text-orange-500">무료배송</span>
                <h2>{name}</h2>
                <p className="min-w-max">
                  <ProductSalePercentage //
                    isSale={isSale}
                    price={price}
                    salePrice={salePrice}
                  />
                  <ProductPrice //
                    isSale={isSale}
                    price={price}
                    salePrice={salePrice}
                  />
                  <ProductRegularPrice //
                    isSale={isSale}
                    price={price}
                  />
                </p>
              </div>
              <div className="dsy-join w-full rounded-none">
                <button
                  type="button"
                  className="dsy-btn dsy-join-item flex-1 border-none bg-orange-100"
                >
                  <FontAwesomeIcon icon={faCartPlus} /> 장바구니
                </button>
                <button
                  type="button"
                  className="dsy-btn dsy-join-item flex-1 border-none bg-orange-200"
                >
                  <FontAwesomeIcon icon={faCreditCard} /> 구매
                </button>
              </div>
            </div>

            <div className="dsy-card dsy-card-side dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40 transition-all duration-300">
              <figure>
                <Image
                  src={images[0]?.src ?? ImgNoImg}
                  width={images[0]?.width}
                  height={images[0]?.height}
                  alt={name}
                  className="aspect-[3/2] w-40 cursor-pointer object-cover transition-all duration-300 hover:scale-105"
                />
              </figure>
              <div className="dsy-card-body gap-0">
                <span className="text-orange-500">무료배송</span>
                <h2>{name}</h2>
                <p className="min-w-max">
                  <ProductSalePercentage //
                    isSale={isSale}
                    price={price}
                    salePrice={salePrice}
                  />
                  <ProductPrice //
                    isSale={isSale}
                    price={price}
                    salePrice={salePrice}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <ImageSelector
        onSelect={(data) => {
          const { id, src, width, height } = data;
          if (images.some((item) => item.id === id)) return alert("이미 추가된 이미지입니다.");
          setImages((prev) => [...prev, { id, src, width, height }]);
        }}
      />
    </main>
  );
}
