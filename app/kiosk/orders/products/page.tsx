"use client";

import { Product, useProducts } from "@/api/products";
import { ColumnList } from "@/components/ColumnList";
import { AssetPreviewDialog } from "@/components/Dialogs/AssetDialog/AssetPreviewDialog";
import { Input } from "@/components/Input";
import { useModal } from "@/extra/modal";
import { cn } from "@/extra/utils";
import { useCart } from "@/hooks/useCart";
import { useItemSelection } from "@/hooks/useItemSelection";
import {
  faCartPlus,
  faCartShopping,
  faCreditCard,
  faMinus,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const modalCtrl = useModal();
  const { data: products } = useProducts();
  const cart = useCart();
  const selected = useItemSelection();
  const selectedProduct = products?.data?.find((item) => item.id === selected.ids[0]);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(1);

  const increaseSelectedProductQuantity = () => {
    setSelectedProductQuantity((prev) => prev + 1);
  };
  const decreaseSelectedProductQuantity = () => {
    setSelectedProductQuantity((prev) => (prev === 1 ? prev : prev - 1));
  };

  const openAssetPreviewDialog = (src: string) => {
    modalCtrl.open(<AssetPreviewDialog src={src} />);
  };
  const onProductCartClick = (item: Product) => {
    // cart.addProduct(item);
    selected.select(item.id);
  };

  return (
    <div className="h-full w-full overflow-auto">
      <ColumnList
        threashold={[0, 2, 640, 900, 1200, Infinity]}
        className="flex items-start justify-center gap-2 p-2"
      >
        {(count, columnIndex) => (
          <ol className="flex-1 space-y-2" key={columnIndex}>
            {products?.data
              ?.filter((_, index) => index % count === columnIndex)
              .map((item) => (
                <li
                  key={item.id}
                  className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-white bg-opacity-40"
                >
                  <figure>
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105"
                      onDoubleClick={() => openAssetPreviewDialog(item.imgSrc)}
                    />
                  </figure>
                  <div className="dsy-card-body gap-0">
                    <h2 className="text-lg">{item.name}</h2>
                    <p>
                      <span className="text-xl text-[#e63740] max-sm:text-lg">
                        {item.isSale
                          ? Math.round((1 - item.salePrice / item.price) * 100) + "%"
                          : item.price === 0
                          ? "100%"
                          : ""}
                      </span>{" "}
                      <span className="text-xl font-bold max-sm:text-lg">
                        {item.isSale
                          ? item.salePrice.toLocaleString()
                          : item.price === 0
                          ? "Free"
                          : item.price.toLocaleString()}
                      </span>
                      {item.price === 0 ? " " : "원 "}
                      <span className="text-[#999999] line-through">
                        {item.isSale && item.price.toLocaleString() + "원"}
                      </span>
                    </p>
                  </div>
                  <div className="dsy-join w-full rounded-none">
                    <button
                      type="button"
                      className="dsy-join-item dsy-btn flex-1 border-none bg-white"
                      onClick={() => onProductCartClick(item)}
                    >
                      <FontAwesomeIcon icon={faCartPlus} /> 장바구니
                    </button>
                    <button
                      type="button"
                      className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200 max-sm:hidden"
                    >
                      <FontAwesomeIcon icon={faCreditCard} /> 구매
                    </button>
                  </div>
                </li>
              ))}
          </ol>
        )}
      </ColumnList>

      <div className="dsy-indicator fixed bottom-10 right-10">
        <span className="dsy-badge dsy-badge-info dsy-indicator-item py-1">
          {cart.products.length}
        </span>
        <Link
          href="cart"
          // htmlFor="cart"
          className="dsy-drawer-button dsy-btn-md dsy-btn bg-white shadow-md"
        >
          <FontAwesomeIcon icon={faCartShopping} fontSize={16} />
        </Link>
      </div>

      <div
        className={cn("fixed -bottom-full flex w-screen transition-all duration-300", {
          "bottom-0": !selected.isEmpty,
        })}
      >
        <div className="dsy-card m-auto w-96 rounded-b-none bg-white bg-opacity-60 backdrop-blur-md">
          <div className="dsy-card-body">
            <button
              type="button"
              className="dsy-btn-ghost dsy-btn-sm dsy-btn-circle dsy-btn absolute right-6 top-4"
              onClick={() => {
                selected.clear();
                setSelectedProductQuantity(1);
              }}
            >
              ✕
            </button>

            <h2 className="text-lg">{selectedProduct?.name}</h2>
            <p>
              <span className="text-xl text-[#e63740] max-sm:text-lg">
                {selectedProduct?.isSale
                  ? Math.round((1 - selectedProduct?.salePrice / selectedProduct?.price) * 100) +
                    "%"
                  : selectedProduct?.price === 0
                  ? "100%"
                  : ""}
              </span>{" "}
              <span className="text-xl font-bold max-sm:text-lg">
                {selectedProduct?.isSale
                  ? (selectedProduct?.salePrice * selectedProductQuantity).toLocaleString()
                  : selectedProduct?.price === 0
                  ? "Free"
                  : (selectedProduct?.price || 0 * selectedProductQuantity).toLocaleString()}
              </span>
              {selectedProduct?.price === 0 ? " " : "원 "}
              <span className="text-[#999999] line-through">
                {selectedProduct?.isSale &&
                  (selectedProduct?.price * selectedProductQuantity).toLocaleString() + "원"}
              </span>
            </p>

            <div className="h-2"></div>

            <div className="dsy-join w-full">
              <div className="dsy-join-item flex flex-1">
                <button
                  type="button"
                  className="dsy-join-item dsy-btn inline-block flex-1 border-none bg-white"
                  onClick={decreaseSelectedProductQuantity}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <Input
                  className="inline-block h-full w-10 rounded-none border-none"
                  value={selectedProductQuantity}
                />
                <button
                  type="button"
                  className="dsy-join-item dsy-btn inline-block flex-1 border-none bg-white"
                  onClick={increaseSelectedProductQuantity}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>

              <button
                type="button"
                className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
                onClick={() => {
                  if (selectedProduct === undefined) return;
                  cart.addProduct(selectedProduct);
                  cart.changeQuantity({
                    id: selectedProduct.id,
                    offset: selectedProductQuantity - 1,
                  });
                  selected.clear();
                  setSelectedProductQuantity(1);
                }}
              >
                <FontAwesomeIcon icon={faCartPlus} /> 담기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
