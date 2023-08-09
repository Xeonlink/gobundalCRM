"use client";

import {
  RawProduct,
  useCreateProduct,
  useDeleteProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import { ModalProps } from "@/extra/type";
import { diff } from "@/extra/utils";
import { useModal } from "@/hooks/useModal";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBoxes,
  faCheck,
  faCoins,
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faImage,
  faInfinity,
  faListOl,
  faNotdef,
  faPaperPlane,
  faSignature,
  faTrashAlt,
  faWon,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { CheckBox } from "../CheckBox";
import { FaIcon } from "../FaIcon";
import { Input } from "../Input";
import AssetSelector from "../Selectors/AssetSelector";
import { AssetPreviewDialog } from "./AssetDialog/AssetPreviewDialog";

const defaultProduct: RawProduct = {
  name: "",
  price: 0,
  isSale: false,
  salePrice: 0,
  remain: 0,
  enabled: false,
  imgSrc: "",
};

type Props = ModalProps<{ mode: "CREATE" } | { mode: "UPDATE"; productId: string }>;

export function ProductDialog(props: Props) {
  const { mode } = props;

  const modalCtrl = useModal();
  const { data: originProduct } = useProduct(mode === "UPDATE" ? props.productId : "", {
    enabled: mode === "UPDATE",
  });
  const [product, productActions] = useTypeSafeReducer(originProduct || defaultProduct, {
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
    setImgSrc: (state, src: string) => {
      state.imgSrc = src;
    },
    reset: () => (mode === "CREATE" ? defaultProduct : originProduct!),
  });
  const createItem = useCreateProduct(product, {
    onSuccess: () => props.closeSelf?.(),
  });
  const updateItem = useUpdateProduct(originProduct?.id!, diff(product, originProduct!), {
    onSuccess: () => props.closeSelf?.(),
  });
  const deleteItem = useDeleteProduct(originProduct?.id!, {
    onSuccess: () => props.closeSelf?.(),
  });
  const openAssetSelector = () => {
    modalCtrl.open(<AssetSelector onSelect={(asset) => productActions.setImgSrc(asset.src)} />);
  };
  const openAssetPreviewDialog = (src: string) => {
    console.log(src);
    modalCtrl.open(<AssetPreviewDialog src={src} />);
  };

  const validity = {
    name: product.name !== "",
    salePrice: product.salePrice === 0 || product.salePrice < product.price,
    remain: product.remain >= -1,
  };
  const isValid = Object.values(validity).every((v) => v);
  const isCleared = mode === "CREATE" ? product === defaultProduct : originProduct === product;
  const isLoading = createItem.isLoading || updateItem.isLoading || deleteItem.isLoading;

  return (
    <dialog
      ref={props.ref}
      onClose={props.closeSelf}
      className="max-h-full max-w-full animate-scaleTo1 overflow-auto rounded-md bg-transparent p-0 backdrop:backdrop-blur-md"
    >
      <div className="mb-3 flex min-w-max flex-row flex-nowrap gap-3">
        <div className="w-96 space-y-3">
          <fieldset className="fieldset">
            <legend className="legend">
              <FaIcon icon={faPaperPlane} fontSize={16} /> 상품정보
            </legend>

            <div className="field">
              <label htmlFor="name" className="label">
                <FaIcon icon={faSignature} /> 상품명
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

            <div className="field">
              <label htmlFor="price" className="label">
                <FaIcon icon={faWon} /> 상품가격
              </label>
              <Input
                id="price"
                placeholder="10,000원"
                disabled={isLoading}
                value={product.price.toLocaleString()}
                onChange={productActions.onPriceChange}
                required
              />
              <div className="absolute bottom-2 right-3">원</div>
            </div>

            <div className="field">
              <label htmlFor="is-sale" className="label">
                <FaIcon icon={faCoins} /> 할인여부
              </label>
              <CheckBox
                checked={product.isSale}
                disable={isLoading}
                toggleFn={productActions.toggleIsSale}
                trueContents={[null, "할인중"]}
                falseContents={[null, "정가"]}
              />
            </div>

            <div className="field">
              <label htmlFor="sale-price" className="label">
                <FaIcon icon={faWon} /> 할인가격
              </label>
              <Input
                id="sale-price"
                placeholder="10,000원"
                disabled={isLoading}
                value={product.salePrice.toLocaleString()}
                onChange={productActions.onSalePriceChange}
                required
                invalid={!validity.salePrice}
              />
              <div className="absolute bottom-2 right-3">원</div>
            </div>

            <div className="field">
              <label htmlFor="is-sale" className="label">
                <FaIcon icon={faBoxes} /> 재고
              </label>
              <CheckBox
                checked={product.remain === -1}
                disable={isLoading}
                toggleFn={productActions.toggleRemainInfinite}
                trueContents={[faInfinity, "무한"]}
                falseContents={[faListOl, "수량"]}
              />
              <Input
                id="remain"
                placeholder="10,000개"
                disabled={isLoading || product.remain === -1}
                value={product.remain.toLocaleString()}
                onChange={productActions.onRemainChange}
                required
                invalid={!validity.remain}
              />
              <div className="absolute bottom-2 right-3">개</div>
            </div>

            <div className="field">
              <label htmlFor="enabled" className="label">
                <FaIcon icon={product.enabled ? faEye : faEyeSlash} /> 활성화 여부
              </label>
              <CheckBox
                checked={product.enabled}
                disable={isLoading}
                toggleFn={productActions.toggleEnabled}
                trueContents={[faEye, "보여짐"]}
                falseContents={[faEyeSlash, "안보여짐"]}
              />
            </div>
          </fieldset>
        </div>

        <div className="w-80 space-y-3">
          <fieldset className="fieldset">
            <legend className="legend">
              <FaIcon icon={faImage} fontSize={16} /> 상품이미지
            </legend>

            {product.imgSrc === "" ? (
              <div className="flex min-h-[8rem] items-center justify-center">
                <FaIcon icon={faImage} className="mr-2" /> 상품이미지를 선택해주세요.
              </div>
            ) : (
              <button
                type="button"
                className="mb-3 w-full"
                onDoubleClick={() => openAssetPreviewDialog(product.imgSrc)}
              >
                <img src={product.imgSrc} alt="상품이미지" className="m-auto" />
              </button>
            )}

            <button type="button" className="btn shadow-none" onClick={openAssetSelector}>
              <FaIcon icon={faCheck} /> 이미지 선택
            </button>
          </fieldset>
        </div>
      </div>

      <form method="dialog" className="flex justify-center gap-2">
        {/* Close */}
        <button className="btn" disabled={isLoading}>
          <FaIcon icon={faX} isLoading={isLoading} value="닫기" />
        </button>

        {/* Clear */}
        <button
          type="button"
          className="btn"
          disabled={isCleared || isLoading}
          onClick={productActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} isLoading={isLoading} value="초기화" />
        </button>

        {/* Delete */}
        {mode === "UPDATE" ? (
          <button
            type="button"
            className="btn"
            disabled={isLoading}
            onClick={() => deleteItem.mutate()}
          >
            <FaIcon icon={faTrashAlt} isLoading={isLoading} value="삭제" />
          </button>
        ) : null}

        {/* Save */}
        <button
          type="button"
          className="btn"
          onClick={mode === "CREATE" ? () => createItem.mutate() : () => updateItem.mutate()}
          disabled={!isValid || isLoading}
        >
          <FaIcon icon={faFloppyDisk} isLoading={isLoading} value="저장" />
        </button>
      </form>
    </dialog>
  );
}
