"use client";

import { useCreateCartProduct } from "@/app/api/cart_products/accessors";
import { ModalProps } from "@/extra/modal/modal";
import { faCartPlus, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "@prisma/client";
import { useState } from "react";
import { Input } from "../Input";
import { ProductPrice } from "../ProductCard/ProductPrice";
import { ProductRegularPrice } from "../ProductCard/ProductRegularPrice";
import { ProductSalePercentage } from "../ProductCard/ProductSalePercentage";

type Props = ModalProps<{
  product: Product;
}>;

export function ProductToCartAmount(props: Props) {
  const { product, ref, closeSelf } = props;
  const { isSale, salePrice, price, name } = product!;

  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev === 1 ? prev : prev - 1));
  };

  const createCartProduct = useCreateCartProduct({
    onSuccess: closeSelf,
  });

  const onClick = () => {
    createCartProduct.mutate({
      productId: product.id,
      quantity,
    });
  };

  return (
    <dialog
      ref={ref}
      className="dsy-modal justify-items-center max-sm:dsy-modal-bottom"
      onClose={closeSelf}
    >
      <form method="dialog" className="dsy-modal-box max-h-fit max-w-sm bg-base-100">
        <button
          className="dsy-btn-ghost dsy-btn dsy-btn-sm dsy-btn-circle absolute right-4 top-4"
          disabled={createCartProduct.isLoading}
        >
          ✕
        </button>

        <h2 className="text-lg">{name}</h2>
        <p className="mb-6 sm:mb-4">
          <ProductSalePercentage
            isSale={isSale}
            salePrice={salePrice * quantity}
            price={price * quantity}
          />
          <ProductPrice isSale={isSale} salePrice={salePrice * quantity} price={price * quantity} />
          <ProductRegularPrice isSale={isSale} price={price * quantity} />
        </p>

        <div className="dsy-join w-full">
          <div className="dsy-join-item flex flex-1 bg-base-200">
            <button
              type="button"
              className="dsy-btn dsy-join-item inline-block flex-1 border-none"
              onClick={decreaseQuantity}
              disabled={createCartProduct.isLoading}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <Input
              id="quantity"
              name="quantity"
              className="inline-block h-full w-12 rounded-none border-none bg-transparent text-center"
              value={quantity}
              readOnly
              disabled={createCartProduct.isLoading}
            />
            <button
              type="button"
              className="dsy-btn dsy-join-item inline-block flex-1 border-none"
              onClick={increaseQuantity}
              disabled={createCartProduct.isLoading}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <button
            type="button"
            className="dsy-btn dsy-join-item flex-1 border-none bg-orange-200"
            onClick={onClick}
            disabled={createCartProduct.isLoading}
          >
            <FontAwesomeIcon icon={faCartPlus} /> 담기
          </button>
        </div>
      </form>
    </dialog>
  );
}
