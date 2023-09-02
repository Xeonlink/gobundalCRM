"use client";

import { Product, useProducts } from "@/api/products";
import { AssetPreviewDialog } from "@/components/Dialogs/AssetDialog/AssetPreviewDialog";
import { useModal } from "@/extra/modal";
import { useCart } from "@/hooks/useCart";
import { useItemSelection } from "@/hooks/useItemSelection";
import { useSimpleWindowSize } from "@/hooks/useWindowSize";
import { faCartPlus, faCartShopping, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Page() {
  const modalCtrl = useModal();
  const { data: products } = useProducts();
  const cart = useCart();
  const selected = useItemSelection();

  const openAssetPreviewDialog = (src: string) => {
    modalCtrl.open(<AssetPreviewDialog src={src} />);
  };
  const onProductCartClick = (item: Product) => {
    cart.addProduct(item);
  };

  return (
    <div className="h-full w-full overflow-auto">
      <ColumnList threashold={[0, 640, 900, 1200, Infinity]}>
        {(count, columnIndex) => (
          <ol className="w-72 space-y-2">
            {products?.data
              ?.filter((_, index) => index % count === columnIndex)
              .map((item) => (
                <li
                  key={item.id}
                  className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-white bg-opacity-40"
                  onClick={selected.onItemClick(item.id)}
                >
                  <figure>
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="m-auto cursor-pointer object-contain transition-all duration-300 hover:scale-105"
                      onDoubleClick={() => openAssetPreviewDialog(item.imgSrc)}
                    />
                  </figure>
                  <div className="dsy-card-body gap-0">
                    <h2 className="text-lg">{item.name}</h2>
                    <p>
                      <ProductPrice product={item} />
                    </p>
                  </div>
                  <div className="dsy-join w-full rounded-none">
                    <button
                      type="button"
                      className="dsy-join-item dsy-btn flex-1 border-none bg-white"
                      onClick={() => onProductCartClick(item)}
                    >
                      <FaIcon icon={faCartPlus} /> 장바구니
                    </button>
                    <button
                      type="button"
                      className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
                    >
                      <FaIcon icon={faCreditCard} /> 구매
                    </button>
                  </div>
                </li>
              ))}
          </ol>
        )}
      </ColumnList>

      <div className="dsy-drawer dsy-drawer-end">
        <input id="cart" type="checkbox" className="dsy-drawer-toggle" />
        <div className="dsy-drawer-content dsy-indicator fixed bottom-10 right-10">
          <span className="dsy-badge dsy-badge-info dsy-indicator-item py-1">
            {cart.products.length}
          </span>
          <Link
            href="cart"
            // htmlFor="cart"
            className="dsy-drawer-button dsy-btn-md dsy-btn bg-white shadow-md"
          >
            <FaIcon icon={faCartShopping} fontSize={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

type Props = {
  threashold: number[];
  children: (columnCount: number, index: number) => React.ReactNode;
};

function ColumnList(props: Props) {
  const { threashold, children } = props;

  const wCount = useSimpleWindowSize(threashold);

  return (
    <div className="flex items-start justify-center gap-2 p-2">
      {new Array(wCount).fill(0).map((_, i) => children(wCount, i))}
    </div>
  );
}

function ProductPrice(props: { product: Product }) {
  const { product: item } = props;

  return (
    <>
      <span className="text-xl text-[#e63740]">
        {item.isSale
          ? Math.round((1 - item.salePrice / item.price) * 100) + "%"
          : item.price === 0
          ? "100%"
          : ""}
      </span>{" "}
      <span className="text-xl font-bold">
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
    </>
  );
}

function SalePercentage(props: { product: Product }) {
  const { product: item } = props;

  return (
    <span className="text-xl text-[#e63740]">
      {item.isSale
        ? Math.round((1 - item.salePrice / item.price) * 100) + "%"
        : item.price === 0
        ? "100%"
        : ""}
    </span>
  );
}

function ProductPriceSpan(props: { product: Product }) {}
