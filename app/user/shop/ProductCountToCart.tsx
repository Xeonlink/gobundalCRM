"use client";

import { Input } from "@/components/Input";
import { useCart } from "@/hooks/useCart";
import { faCartPlus, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

export function ProductCountToCart() {
  const cart = useCart();
  const product = cart.candidate;
  const [productQuantity, setproductQuantity] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const increaseProductQuantity = () => {
    setproductQuantity((prev) => prev + 1);
  };
  const decreaseProductQuantity = () => {
    setproductQuantity((prev) => (prev === 1 ? prev : prev - 1));
  };

  useEffect(() => {
    if (cart.candidate === null) return;
    dialogRef.current?.showModal();
    setproductQuantity(1);
  }, [cart.candidate]);

  return (
    <dialog ref={dialogRef} className="dsy-modal justify-items-center max-sm:dsy-modal-bottom">
      <div className="dsy-modal-box max-w-sm bg-base-100">
        <form method="dialog">
          <button
            className="dsy-btn-ghost dsy-btn-sm dsy-btn-circle dsy-btn absolute right-4 top-4"
            onClick={() => cart.clearCandidate()}
          >
            ✕
          </button>
        </form>

        <h2 className="text-lg">{product?.name}</h2>
        <p className="mb-6 sm:mb-4">
          <span className="text-xl text-[#e63740] max-sm:text-lg">
            {product?.isSale
              ? Math.round((1 - product?.salePrice / product?.price) * 100) + "%"
              : product?.price === 0
              ? "100%"
              : ""}
          </span>{" "}
          <span className="text-xl font-bold max-sm:text-lg">
            {product?.isSale
              ? (product?.salePrice * productQuantity).toLocaleString()
              : product?.price === 0
              ? "Free"
              : (product?.price || 0 * productQuantity).toLocaleString()}
          </span>
          {product?.price === 0 ? " " : "원 "}
          <span className="text-[#999999] line-through">
            {product?.isSale && (product?.price * productQuantity).toLocaleString() + "원"}
          </span>
        </p>

        <div className="dsy-join w-full">
          <div className="dsy-join-item flex flex-1 bg-base-200">
            <button
              type="button"
              className="dsy-join-item dsy-btn inline-block flex-1 border-none"
              onClick={decreaseProductQuantity}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <Input
              className="inline-block h-full w-10 rounded-none border-none bg-transparent text-center"
              value={productQuantity}
            />
            <button
              type="button"
              className="dsy-join-item dsy-btn inline-block flex-1 border-none"
              onClick={increaseProductQuantity}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <button
            type="button"
            className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
            onClick={() => {
              if (product === null) return;
              cart.addProduct(product);
              cart.changeQuantity({
                id: product.id,
                offset: productQuantity - 1,
              });
              cart.clearCandidate();
              dialogRef.current?.close();
            }}
          >
            <FontAwesomeIcon icon={faCartPlus} /> 담기
          </button>
        </div>
      </div>
      <form method="dialog" className="dsy-modal-backdrop">
        <button onClick={() => cart.clearCandidate()}>Close</button>
      </form>
    </dialog>
  );
}
