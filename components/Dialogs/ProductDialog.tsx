"use client";

import {
  RawProduct,
  useCreateProduct,
  useDeleteProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import { ModalProps } from "@/extra/modal";
import { diff } from "@/extra/utils";
import { useModal } from "@/extra/modal";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBoxes,
  faCheck,
  faCoins,
  faCopy,
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

type Props = ModalProps<
  { mode: "CREATE"; base?: RawProduct } | { mode: "UPDATE"; productId: string }
>;

export function ProductDialog(props: Props) {
  const { mode } = props;

  const modalCtrl = useModal();
  const { data: originProduct } = useProduct(mode === "UPDATE" ? props.productId : "", {
    enabled: mode === "UPDATE",
  });
  const [product, productActions] = useTypeSafeReducer(
    mode === "CREATE" ? props.base || defaultProduct : originProduct!,
    {
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
    },
  );
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
    modalCtrl.open(<AssetPreviewDialog src={src} />);
  };
  const openProductCopyDialog = () => {
    modalCtrl.open(<ProductDialog mode="CREATE" base={product} />);
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
    <dialog ref={props.ref} onClose={props.closeSelf} className="dsy-modal">
      <form method="dialog" className="dsy-modal-box w-96 bg-opacity-60 backdrop-blur-md">
        <div className="dsy-form-control">
          <label htmlFor="name" className="dsy-label relative py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faSignature} /> 상품명
            </span>
            <Input
              id="name"
              placeholder="한라봉청 3kg"
              disabled={isLoading}
              value={product.name}
              onChange={productActions.onNameChange}
              invalid={!validity.name}
              className="w-full max-w-[15rem]"
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="price" className="dsy-label relative py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faWon} /> 상품가격
            </span>
            <Input
              id="price"
              placeholder="10,000원"
              disabled={isLoading}
              value={product.price.toLocaleString()}
              onChange={productActions.onPriceChange}
              required
              className="w-full max-w-[15rem]"
            />
            <div className="absolute bottom-2 right-3">원</div>
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="is-sale" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faCoins} /> 할인여부
            </span>
            <input
              type="checkbox"
              name="isSale"
              id="is-sale"
              className="dsy-toggle-success dsy-toggle"
              disabled={isLoading}
              checked={product.isSale}
              onChange={productActions.toggleIsSale}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="sale-price" className="dsy-label relative py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faWon} /> 할인가격
            </span>
            <Input
              id="sale-price"
              placeholder="10,000원"
              disabled={isLoading}
              value={product.salePrice.toLocaleString()}
              onChange={productActions.onSalePriceChange}
              required
              invalid={!validity.salePrice}
              className="w-full max-w-[15rem]"
            />
            <div className="absolute bottom-2 right-3">원</div>
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="remain" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faInfinity} /> 무한재고
            </span>
            <input
              type="checkbox"
              name="remain"
              id="remain"
              className="dsy-toggle-success dsy-toggle"
              disabled={isLoading}
              onChange={productActions.toggleRemainInfinite}
            />
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="is-sale" className="dsy-label relative py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={faBoxes} /> 재고
            </span>
            <Input
              id="remain"
              placeholder="10,000개"
              disabled={isLoading || product.remain === -1}
              value={product.remain.toLocaleString()}
              onChange={productActions.onRemainChange}
              required
              invalid={!validity.remain}
              className="w-full max-w-[15rem]"
            />
            <div className="absolute bottom-2 right-3">개</div>
          </label>
        </div>

        <div className="dsy-form-control">
          <label htmlFor="enabled" className="dsy-label gap-2 py-1">
            <span className="dsy-label-text min-w-fit">
              <FaIcon icon={product.enabled ? faEye : faEyeSlash} /> 활성화
            </span>
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
        </div>

        <div className="dsy-divider"></div>

        <div>
          {product.imgSrc === "" ? (
            <div className="flex min-h-[8rem] items-center justify-center rounded-md bg-[#f0f0f0]">
              <FaIcon icon={faImage} className="mr-2" /> 상품이미지를 선택해주세요.
            </div>
          ) : (
            <button
              type="button"
              onDoubleClick={() => openAssetPreviewDialog(product.imgSrc)}
              className="w-full"
            >
              <img src={product.imgSrc} alt="상품이미지" className="m-auto max-h-40" />
            </button>
          )}

          <div className="text-right">
            <button
              type="button"
              className="dsy-btn-sm dsy-btn mt-2 inline-block"
              onClick={openAssetSelector}
            >
              <FaIcon icon={faCheck} /> 이미지 선택
            </button>
          </div>
        </div>

        <div className="dsy-modal-action">
          {/* Close */}
          <button className="dsy-btn-sm dsy-btn" disabled={isLoading}>
            <FaIcon icon={faX} isLoading={isLoading} value="닫기" />
          </button>

          {/* Clear */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isCleared || isLoading}
            onClick={productActions.reset}
          >
            <FaIcon icon={faNotdef} rotation={90} isLoading={isLoading} value="초기화" />
          </button>

          {/* Copy */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            disabled={isLoading}
            onClick={openProductCopyDialog}
          >
            <FaIcon icon={faCopy} isLoading={isLoading} value="복제" />
          </button>

          {/* Delete */}
          {mode === "UPDATE" ? (
            <button
              type="button"
              className="dsy-btn-sm dsy-btn"
              disabled={isLoading}
              onClick={() => deleteItem.mutate()}
            >
              <FaIcon icon={faTrashAlt} isLoading={isLoading} value="삭제" />
            </button>
          ) : null}

          {/* Save */}
          <button
            type="button"
            className="dsy-btn-sm dsy-btn"
            onClick={mode === "CREATE" ? () => createItem.mutate() : () => updateItem.mutate()}
            disabled={!isValid || isLoading}
          >
            <FaIcon icon={faFloppyDisk} isLoading={isLoading} value="저장" />
          </button>
        </div>
      </form>
    </dialog>
  );
}
