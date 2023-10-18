"use client";

import { Asset } from "@/api/assets";
import { useProductCategories } from "@/api/product_categories";
import { defaultProduct, useProduct, useUpdateProduct } from "@/api/products";
import { Input } from "@/components/Input";
import AssetSelector from "@/components/Selectors/AssetSelector";
import { useModal } from "@/extra/modal";
import { PageProps } from "@/extra/type";
import { diff } from "@/extra/utils";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
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
  faTableCellsLarge,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page(props: PageProps<{ productId: string }, {}>) {
  const { productId } = props.params;

  const modalCtrl = useModal();
  const router = useRouter();
  const { data: originProduct } = useProduct(productId);
  const { data: productCategories } = useProductCategories();
  const [product, productActions] = useTypeSafeReducer(originProduct!, {
    toggleEnabled: (state) => {
      state.enabled = !state.enabled;
    },
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    onPriceChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.price = parseInt(e.target.value.replaceAll(",", "")) || 0;
    },
    toggleIsSale: (state) => {
      state.isSale = !state.isSale;
    },
    onSalePriceChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.salePrice = parseInt(e.target.value.replaceAll(",", "")) || 0;
    },
    toggleRemainInfinite: (state) => {
      state.remain = state.remain < 0 ? 0 : -1;
    },
    onRemainChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.remain = parseInt(e.target.value.replaceAll(",", "")) || 0;
    },
    setDescriptionImage: (state, asset: Asset) => {
      state.descriptionImage = {
        id: asset.id,
        src: asset.src,
        width: asset.width,
        height: asset.height,
      };
    },
    removeDescriptionImage: (state) => {
      state.descriptionImage = defaultProduct.descriptionImage;
    },
    addProductImage: (state, asset: Asset) => {
      state.images.push({
        id: asset.id,
        src: asset.src,
        width: asset.width,
        height: asset.height,
      });
    },
    removeProductImage: (state, id: string) => {
      state.images = state.images.filter((item) => item.id !== id);
    },
    onCategoryChange: (state, e: React.ChangeEvent<HTMLSelectElement>) => {
      state.category = e.target.value;
    },
    reset: () => originProduct!,
  });
  const updateItem = useUpdateProduct(productId, diff(product, originProduct!), {
    onSuccess: () => router.back(),
  });
  const isLoading = updateItem.isLoading;

  const validity = {
    name: product.name !== "",
    images: product.images.length > 0,
    salePrice: product.salePrice === 0 || product.salePrice < product.price,
    remain: product.remain >= -1,
    descriptionImage: product.descriptionImage.src !== "",
  };
  const isValid = Object.values(validity).every((v) => v);

  const openProductImageSelector = () => {
    modalCtrl.open(<AssetSelector onSelect={(asset) => productActions.addProductImage(asset)} />);
  };
  const openDescriptionImageSelector = () => {
    modalCtrl.open(
      <AssetSelector onSelect={(asset) => productActions.setDescriptionImage(asset)} />,
    );
  };

  return (
    <main className="min-h-screen">
      {/* Toolbar */}
      <ul className="flex w-full flex-wrap items-center justify-center bg-base-200 py-2 max-sm:flex-col">
        <li>
          {/* 활성화 */}
          <label className="dst-btn-ghost dsy-btn disabled:bg-transparent">
            <FontAwesomeIcon icon={product.enabled ? faEye : faEyeSlash} />{" "}
            {product.enabled ? "보임중" : "숨김중"}
            <input
              type="checkbox"
              name="enabled"
              id="enabled"
              className="dsy-toggle-success dsy-toggle"
              disabled={isLoading}
              checked={product.enabled}
              onChange={productActions.toggleEnabled}
            />
          </label>
        </li>

        <li>
          {/* 할인여부 */}
          <label className="dst-btn-ghost dsy-btn disabled:bg-transparent">
            <FontAwesomeIcon icon={product.isSale ? faHandshake : faHandshakeSlash} />{" "}
            {product.isSale ? "할인중" : "정가로"}
            <input
              type="checkbox"
              name="enabled"
              id="enabled"
              className="dsy-toggle-success dsy-toggle"
              disabled={isLoading}
              checked={product.isSale}
              onChange={productActions.toggleIsSale}
            />
          </label>
        </li>

        <li>
          {/* 재고무한여부 */}
          <label className="dst-btn-ghost dsy-btn disabled:bg-transparent">
            <FontAwesomeIcon icon={product.remain === -1 ? faInfinity : faBoxes} />{" "}
            {product.remain === -1 ? "무한재고" : "유한재고"}
            <input
              type="checkbox"
              name="enabled"
              id="enabled"
              className="dsy-toggle-success dsy-toggle"
              disabled={isLoading}
              checked={product.remain === -1}
              onChange={productActions.toggleRemainInfinite}
            />
          </label>
        </li>

        <li>
          {/* Clear */}
          <button type="button" className="dsy-btn" onClick={productActions.reset}>
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
                <FontAwesomeIcon icon={faSignature} /> 상품명을 입력해주세요.&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <Input
              id="name"
              placeholder="한라봉청 3kg"
              disabled={isLoading}
              value={product.name}
              onChange={productActions.onNameChange}
              invalid={!validity.name}
            />
          </div>

          <div className="dsy-form-control">
            <label htmlFor="name" className="dsy-label">
              <strong className="dsy-label-text">
                사진을 추가해 보세요.&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {product.images.map((item) => (
                <figure className="relative h-28 w-fit overflow-hidden rounded-md shadow-md">
                  <Image
                    src={item.src}
                    alt="상품이미지"
                    className="h-full w-full object-cover"
                    width={item.width}
                    height={item.height}
                  />
                  <button
                    type="button"
                    className="dsy-btn-sm dsy-btn absolute right-0 top-0 rounded-none rounded-bl-md border-none bg-white"
                    onClick={() => productActions.removeProductImage(item.id)}
                  >
                    x
                  </button>
                </figure>
              ))}
              <button
                type="button"
                className="dsy-btn h-28 w-28 flex-col rounded-lg bg-transparent"
                onClick={openProductImageSelector}
              >
                <FontAwesomeIcon icon={faImage} />
                <span className="text-sm">사진추가</span>
              </button>
            </div>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="name" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faTableCellsLarge} /> 카테고리&nbsp;
              </strong>
            </label>
            <select
              id="name"
              placeholder="한라봉청 3kg"
              disabled={isLoading}
              value={product.category || "none"}
              onChange={productActions.onCategoryChange}
              className="dsy-select-bordered dsy-select w-full"
            >
              <option value="none">없음</option>
              {productCategories?.data.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="price" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faWon} /> 상품가격&nbsp;
              </strong>
            </label>
            <div className="relative">
              <Input
                id="price"
                placeholder="10,000원"
                disabled={isLoading}
                value={product.price.toLocaleString()}
                onChange={productActions.onPriceChange}
                required
                className="w-full"
              />
              <div className="absolute bottom-1/2 right-4 translate-y-1/2">원</div>
            </div>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="sale-price" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faWon} /> 할인가격
              </strong>
            </label>
            <div className="relative">
              <Input
                id="sale-price"
                placeholder="10,000원"
                disabled={isLoading}
                value={product.salePrice.toLocaleString()}
                onChange={productActions.onSalePriceChange}
                required
                invalid={!validity.salePrice}
                className="w-full"
              />
              <div className="absolute bottom-1/2 right-4 translate-y-1/2">원</div>
            </div>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="is-sale" className="dsy-label">
              <strong className="dsy-label-text">
                <FontAwesomeIcon icon={faBoxes} /> 재고
              </strong>
            </label>
            <div className="relative">
              <Input
                id="remain"
                placeholder="10,000개"
                disabled={isLoading || product.remain === -1}
                value={product.remain.toLocaleString()}
                onChange={productActions.onRemainChange}
                required
                invalid={!validity.remain}
                className="w-full"
              />
              <div className="absolute bottom-1/2 right-4 translate-y-1/2">원</div>
            </div>
          </div>

          <div className="dsy-form-control">
            <label htmlFor="name" className="dsy-label">
              <strong className="dsy-label-text">
                상품설명 이미지를 추가해 보세요.&nbsp;
                <span className="align-top text-xs text-orange-500">* 필수</span>
              </strong>
            </label>
            {product.descriptionImage.src === "" ? (
              <button
                type="button"
                className="dsy-btn h-28 w-28 flex-col rounded-lg bg-transparent"
                onClick={openDescriptionImageSelector}
              >
                <FontAwesomeIcon icon={faImage} />
                <span className="text-sm">사진추가</span>
              </button>
            ) : (
              <figure className="relative h-28 w-fit overflow-hidden rounded-md shadow-md">
                <Image
                  src={product.descriptionImage.src}
                  alt="상품설명 이미지"
                  className="h-full w-full object-cover"
                  width={product.descriptionImage.width}
                  height={product.descriptionImage.height}
                />
                <button
                  type="button"
                  className="dsy-btn-sm dsy-btn absolute right-0 top-0 rounded-none rounded-bl-md border-none bg-white"
                  onClick={() => productActions.removeDescriptionImage()}
                >
                  x
                </button>
              </figure>
            )}
          </div>
        </form>

        <div className="w-80 space-y-4">
          <h3 className="text-gray-400">미리보기</h3>

          <div className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40 transition-all duration-300">
            <figure>
              <Image
                src={product.images[0].src || ImgNoImg}
                alt={product.name}
                width={product.images[0].width || 450}
                height={product.images[0].height || 300}
                className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105"
              />
            </figure>
            <div className="dsy-card-body gap-0">
              <span className="text-orange-500">무료배송</span>
              <h2>{product.name}</h2>
              <p className="min-w-max">
                <span className="text-lg text-[#e63740]">
                  {product.isSale
                    ? Math.round((1 - product.salePrice / product.price) * 100) + "%"
                    : product.price === 0
                    ? "100%"
                    : ""}
                </span>{" "}
                <span className="text-xl font-bold">
                  {product.isSale
                    ? product.salePrice.toLocaleString()
                    : product.price === 0
                    ? "Free"
                    : product.price.toLocaleString()}
                </span>
                {product.price === 0 ? " " : "원 "}
                <span className="text-[#999999] line-through">
                  {product.isSale && product.price.toLocaleString() + "원"}
                </span>
              </p>
            </div>
            <div className="dsy-join w-full rounded-none">
              <button
                type="button"
                className="dsy-join-item dsy-btn flex-1 border-none bg-orange-100"
              >
                <FontAwesomeIcon icon={faCartPlus} /> 장바구니
              </button>
              <button
                type="button"
                className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
              >
                <FontAwesomeIcon icon={faCreditCard} /> 구매
              </button>
            </div>
          </div>

          <div className="dsy-card dsy-card-side dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40 transition-all duration-300">
            <figure>
              <Image
                src={product.images[0] || ImgNoImg}
                alt={product.name}
                width={product.images[0].width || 450}
                height={product.images[0].height || 300}
                className="aspect-[3/2] w-40 cursor-pointer object-cover transition-all duration-300 hover:scale-105"
              />
            </figure>
            <div className="dsy-card-body gap-0">
              <span className="text-orange-500">무료배송</span>
              <h2>{product.name}</h2>
              <p className="min-w-max">
                <span className="text-lg text-[#e63740]">
                  {product.isSale
                    ? Math.round((1 - product.salePrice / product.price) * 100) + "%"
                    : product.price === 0
                    ? "100%"
                    : ""}
                </span>{" "}
                <span className="text-xl font-bold">
                  {product.isSale
                    ? product.salePrice.toLocaleString()
                    : product.price === 0
                    ? "Free"
                    : product.price.toLocaleString()}
                </span>
                {product.price === 0 ? " " : "원 "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
