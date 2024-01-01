"use client";

import { Input } from "@/components/Input";
import { ProductPrice } from "@/components/ProductCard/ProductPrice";
import { ProductRegularPrice } from "@/components/ProductCard/ProductRegularPrice";
import { ProductSalePercentage } from "@/components/ProductCard/ProductSalePercentage";
import { PageProps } from "@/extra/type";
import { faCartPlus, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { cache, use, useState } from "react";
import { createCartProductByForm } from "../../../actions";
import { getProduct } from "./actions";

const getProductCached = cache(getProduct);

export default function Page(props: PageProps<{ productId: string }>) {
  const id = props.params.productId;
  const product = use(getProductCached(+id));

  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev === 1 ? prev : prev - 1));
  };

  const { isSale, salePrice, price, name } = product;

  return (
    <dialog
      open
      className="dsy-modal justify-items-center max-sm:dsy-modal-bottom"
      onClose={router.back}
    >
      <form method="dialog" className="dsy-modal-box max-h-fit max-w-sm bg-base-100">
        <button className="dsy-btn-ghost dsy-btn dsy-btn-sm dsy-btn-circle absolute right-4 top-4">
          ✕
        </button>

        <h2 className="text-lg">{name}</h2>
        <p className="mb-6 sm:mb-4">
          <ProductSalePercentage isSale={isSale} salePrice={salePrice} price={price} />
          <ProductPrice isSale={isSale} salePrice={salePrice} price={price} />
          <ProductRegularPrice isSale={isSale} price={price} />
        </p>

        <div className="dsy-join w-full">
          <div className="dsy-join-item flex flex-1 bg-base-200">
            <button
              type="button"
              className="dsy-btn dsy-join-item inline-block flex-1 border-none"
              onClick={decreaseQuantity}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <Input
              id="quantity"
              name="quantity"
              className="inline-block h-full w-10 rounded-none border-none bg-transparent text-center"
              value={quantity}
              readOnly
            />
            <button
              type="button"
              className="dsy-btn dsy-join-item inline-block flex-1 border-none"
              onClick={increaseQuantity}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <button
            formAction={createCartProductByForm.bind(null, product.id)}
            className="dsy-btn dsy-join-item flex-1 border-none bg-orange-200"
            onClick={router.back}
          >
            <FontAwesomeIcon icon={faCartPlus} /> 담기
          </button>
        </div>
      </form>
      <form method="dialog" className="dsy-modal-backdrop bg-black bg-opacity-40">
        <button>Close</button>
      </form>
    </dialog>
  );
}
