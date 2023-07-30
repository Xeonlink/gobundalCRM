"use client";

import { Product, useProduct, useUpdateProduct } from "@/api/products";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import {
  faArrowLeft,
  faBoxes,
  faCoins,
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faInfinity,
  faNotdef,
  faPaperPlane,
  faSignature,
  faSpinner,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Params = { id: string };

export default function Page(props: PageProps<Params>) {
  const { params } = props;

  useAuth();
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const product = useProduct(params.id);
  const [changes, changeActions] = useTypeSafeReducer({} as Partial<Product>, {
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
      if (!state.remain) {
      }
      state.remain = state.remain ?? 0 < 0 ? 0 : -1;
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
    reset: (_) => {
      return {};
    },
  });

  const finalProduct: Partial<Product> = {
    ...product.data,
    ...changes,
  };

  const validity = {
    name: finalProduct.name !== "",
    price: true,
    salePrice:
      (finalProduct.salePrice ?? 0) === 0 ||
      (finalProduct.salePrice ?? 0) < (finalProduct.price ?? 0),
    remain: (finalProduct.remain ?? 0) >= -1,
  };
  const isValid = Object.values(validity).every((v) => v);

  const clearity = {
    name: finalProduct.name === product.data?.name,
    price: finalProduct.price === product.data?.price,
    salePrice: finalProduct.salePrice === product.data?.salePrice,
    remain: finalProduct.remain === product.data?.remain,
    isSale: finalProduct.isSale === product.data?.isSale,
    enabled: finalProduct.enabled === product.data?.enabled,
  };
  const isCleared = Object.values(clearity).every((v) => v);

  const updateProduct = useUpdateProduct(params.id, changes, {
    onSuccess: () => navigate.back(),
  });

  return (
    <main className='p-3 h-full flex-1 overflow-auto'>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <button type='button' className='m-box px-3 py-2 m-hover' onClick={navigate.back}>
          <FaIcon icon={faArrowLeft} /> 뒤로가기
        </button>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Clear */}
        <button
          type='button'
          className='m-box px-3 py-2 m-hover disabled:opacity-40'
          disabled={isCleared || updateProduct.isLoading}
          onClick={changeActions.reset}
        >
          <FaIcon icon={faNotdef} rotation={90} /> 초기화
        </button>

        {/* Save */}
        <button
          type='button'
          className='m-box px-3 py-2 m-hover disabled:opacity-40'
          disabled={!isValid || updateProduct.isLoading}
          onClick={() => updateProduct.mutate()}
        >
          {updateProduct.isLoading ? (
            <>
              <FaIcon icon={faSpinner} className='animate-spin' /> 저장중...
            </>
          ) : (
            <>
              <FaIcon icon={faFloppyDisk} /> 저장
            </>
          )}
        </button>
      </div>

      {/* Form */}
      <form action='' onSubmit={(e) => e.preventDefault()}>
        <div className='flex gap-3 justify-evenly flex-wrap items-start'>
          <fieldset className='fieldset'>
            <legend className='btn text-lg bg-transparent p-2'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 상품정보
            </legend>

            <div className='field'>
              <label htmlFor='name' className='label'>
                <FaIcon icon={faSignature} /> 상품명
              </label>
              <Input
                id='name'
                type='text'
                placeholder='한라봉청 3kg'
                className='input'
                disabled={updateProduct.isLoading}
                value={finalProduct.name}
                onChange={changeActions.onNameChange}
                required
                invalid={!validity.name}
              />
            </div>

            <div className='field'>
              <label htmlFor='price' className='label'>
                <FaIcon icon={faWon} /> 상품가격
              </label>
              <Input
                id='price'
                type='text'
                placeholder='10,000원'
                className='input'
                disabled={updateProduct.isLoading}
                value={finalProduct.price?.toLocaleString()}
                onChange={changeActions.onPriceChange}
                required
                invalid={!validity.price}
              />
              <div className='absolute bottom-2 right-3'>원</div>
            </div>

            <div className='field'>
              <label htmlFor='is-sale' className='label'>
                <FaIcon icon={faCoins} /> 할인여부
              </label>
              <div
                id='is-sale'
                className='flex gap-3 aria-disabled:opacity-40 m-auto'
                aria-disabled={updateProduct.isLoading}
              >
                <button
                  type='button'
                  className='btn w-full shadow-none p-2'
                  disabled={finalProduct.isSale}
                  onClick={changeActions.toggleIsSale}
                >
                  할인중
                </button>
                <button
                  type='button'
                  className='btn w-full shadow-none p-2'
                  disabled={!finalProduct.isSale}
                  onClick={changeActions.toggleIsSale}
                >
                  정가
                </button>
              </div>
            </div>

            <div className='field'>
              <label htmlFor='sale-price' className='label'>
                <FaIcon icon={faWon} /> 할인가격
              </label>
              <Input
                id='sale-price'
                type='text'
                placeholder='10,000원'
                className='input'
                disabled={updateProduct.isLoading}
                value={finalProduct.salePrice?.toLocaleString()}
                onChange={changeActions.onSalePriceChange}
                required
                invalid={!validity.salePrice}
              />
              <div className='absolute bottom-2 right-3'>원</div>
            </div>

            <div className='field'>
              <label htmlFor='is-sale' className='label'>
                <FaIcon icon={faBoxes} /> 재고
              </label>
              <div
                id='is-sale'
                className='flex gap-3 aria-disabled:opacity-40 m-auto mb-3'
                aria-disabled={updateProduct.isLoading}
              >
                <button
                  type='button'
                  className='btn w-full shadow-none p-2'
                  disabled={finalProduct.remain === -1}
                  onClick={changeActions.toggleRemainInfinite}
                >
                  <FaIcon icon={faInfinity} /> 무한
                </button>
                <button
                  type='button'
                  className='btn w-full shadow-none p-2'
                  disabled={finalProduct.remain !== -1}
                  onClick={changeActions.toggleRemainInfinite}
                >
                  수량
                </button>
              </div>
              <Input
                id='remain'
                type='text'
                placeholder='10,000개'
                className='input'
                disabled={updateProduct.isLoading || finalProduct.remain === -1}
                value={finalProduct.remain?.toLocaleString()}
                onChange={changeActions.onRemainChange}
                required
                invalid={!validity.remain}
              />
              <div className='absolute bottom-2 right-3'>개</div>
            </div>

            <div className='field'>
              <label htmlFor='is-sale' className='label'>
                <FaIcon icon={finalProduct.enabled ? faEye : faEyeSlash} /> 활성화 여부
              </label>
              <div
                id='is-sale'
                className='flex gap-3 aria-disabled:opacity-40 m-auto'
                aria-disabled={updateProduct.isLoading}
              >
                <button
                  type='button'
                  className='btn w-full shadow-none p-2'
                  disabled={finalProduct.enabled}
                  onClick={changeActions.toggleEnabled}
                >
                  <FaIcon icon={faEye} /> 보여짐
                </button>
                <button
                  type='button'
                  className='btn w-full shadow-none p-2'
                  disabled={!finalProduct.enabled}
                  onClick={changeActions.toggleEnabled}
                >
                  <FaIcon icon={faEyeSlash} /> 안보여짐
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </form>
    </main>
  );
}
