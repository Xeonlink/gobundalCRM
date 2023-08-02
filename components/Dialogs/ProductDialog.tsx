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
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faBoxes,
  faCoins,
  faEye,
  faEyeSlash,
  faFloppyDisk,
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

const defaultProduct: RawProduct = {
  name: "",
  price: 0,
  isSale: false,
  salePrice: 0,
  remain: 0,
  enabled: false,
};

type Props = ModalProps<
  | {
      mode: "CREATE";
    }
  | {
      mode: "UPDATE";
      productId: string;
    }
>;

export function ProductDialog(props: Props) {
  const { mode } = props;

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
      if (e.target.value === "") {
        state.price = 0;
        return;
      }
      const newPrice = parseInt(e.target.value.replaceAll(",", ""));
      if (!newPrice) return;
      state.price = newPrice;
    },
    toggleIsSale: (state) => {
      state.isSale = !state.isSale;
    },
    onSalePriceChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "") {
        state.salePrice = 0;
        return;
      }
      const newSalePrice = parseInt(e.target.value.replaceAll(",", ""));
      if (!newSalePrice) return;
      state.salePrice = newSalePrice;
    },
    toggleRemainInfinite: (state) => {
      state.remain = state.remain < 0 ? 0 : -1;
    },
    onRemainChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "") {
        state.remain = 0;
        return;
      }
      const newRemain = parseInt(e.target.value.replaceAll(",", ""));
      if (!newRemain) return;
      state.remain = newRemain;
    },
    reset: () => {
      return mode === "CREATE" ? defaultProduct : originProduct!;
    },
  });
  const createProduct = useCreateProduct(product, {
    onSuccess: () => props.closeSelf?.(),
  });
  const updateProduct = useUpdateProduct(originProduct?.id!, diff(product, originProduct!), {
    onSuccess: () => props.closeSelf?.(),
  });
  const deleteProduct = useDeleteProduct(originProduct?.id!, {
    onSuccess: () => props.closeSelf?.(),
  });

  const validity = {
    name: product.name !== "",
    salePrice: product.salePrice === 0 || product.salePrice < product.price,
    remain: product.remain >= -1,
  };
  const isValid = Object.values(validity).every((v) => v);
  const isCleared = mode === "CREATE" ? product === defaultProduct : originProduct === product;
  const isLoading = createProduct.isLoading || updateProduct.isLoading || deleteProduct.isLoading;

  return (
    <dialog
      ref={props.ref}
      onClose={props.closeSelf}
      className='max-w-full max-h-full rounded-md p-0 bg-transparent backdrop:backdrop-blur-md animate-scaleTo1 overflow-auto'
    >
      <div className='flex flex-row flex-nowrap min-w-max mb-3 gap-3'>
        <div className='w-96 space-y-3'>
          <fieldset className='fieldset'>
            <legend className='legend'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 상품정보
            </legend>

            <div className='field'>
              <label htmlFor='name' className='label'>
                <FaIcon icon={faSignature} /> 상품명
              </label>
              <Input
                id='name'
                placeholder='한라봉청 3kg'
                disabled={isLoading}
                value={product.name}
                onChange={productActions.onNameChange}
                invalid={!validity.name}
              />
            </div>

            <div className='field'>
              <label htmlFor='price' className='label'>
                <FaIcon icon={faWon} /> 상품가격
              </label>
              <Input
                id='price'
                placeholder='10,000원'
                disabled={isLoading}
                value={product.price.toLocaleString()}
                onChange={productActions.onPriceChange}
                required
              />
              <div className='absolute bottom-2 right-3'>원</div>
            </div>

            <div className='field'>
              <label htmlFor='is-sale' className='label'>
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

            <div className='field'>
              <label htmlFor='sale-price' className='label'>
                <FaIcon icon={faWon} /> 할인가격
              </label>
              <Input
                id='sale-price'
                placeholder='10,000원'
                disabled={isLoading}
                value={product.salePrice.toLocaleString()}
                onChange={productActions.onSalePriceChange}
                required
                invalid={!validity.salePrice}
              />
              <div className='absolute bottom-2 right-3'>원</div>
            </div>

            <div className='field'>
              <label htmlFor='is-sale' className='label'>
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
                id='remain'
                placeholder='10,000개'
                disabled={isLoading || product.remain === -1}
                value={product.remain.toLocaleString()}
                onChange={productActions.onRemainChange}
                required
                invalid={!validity.remain}
              />
              <div className='absolute bottom-2 right-3'>개</div>
            </div>

            <div className='field'>
              <label htmlFor='enabled' className='label'>
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
      </div>

      <form method='dialog' className='flex justify-center gap-2'>
        {/* Close */}
        <button className='btn' disabled={isLoading}>
          <FaIcon icon={faX} isLoading={isLoading} value='닫기' />
        </button>

        {/* Clear */}
        <button
          type='button'
          className='btn'
          disabled={isCleared || isLoading}
          onClick={productActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} isLoading={isLoading} value='초기화' />
        </button>

        {/* Delete */}
        {mode === "UPDATE" ? (
          <button
            type='button'
            className='btn'
            disabled={isLoading}
            onClick={() => deleteProduct.mutate()}
          >
            <FaIcon icon={faTrashAlt} isLoading={isLoading} value='삭제' />
          </button>
        ) : null}

        {/* Save */}
        <button
          type='button'
          className='btn'
          onClick={mode === "CREATE" ? () => createProduct.mutate() : () => updateProduct.mutate()}
          disabled={!isValid || isLoading}
        >
          <FaIcon icon={faFloppyDisk} isLoading={isLoading} value='저장' />
        </button>
      </form>
    </dialog>
  );
}
