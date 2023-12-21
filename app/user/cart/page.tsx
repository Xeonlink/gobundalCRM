"use client";

import { ProductPrice } from "@/components/ProductCard/ProductPrice";
import { ProductRegularPrice } from "@/components/ProductCard/ProductRegularPrice";
import { ProductSalePercentage } from "@/components/ProductCard/ProductSalePercentage";
import { useCart } from "@/hooks/useCart";
import {
  faBoxes,
  faCaretLeft,
  faCaretRight,
  faCreditCard,
  faLandmark,
  faNotdef,
  faTrash,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const cart = useCart();
  const router = useRouter();

  const totalProductPrice = cart.products.reduce(
    (acc, item) => acc + item.item.price * item.quantity,
    0,
  );
  const totalTaxPrice = totalProductPrice / 10;
  const totalPrice = totalProductPrice + totalTaxPrice;

  return (
    <main className="min-h-screen">
      <h2 className="py-6 text-center text-3xl font-bold">장바구니</h2>

      {/* 상품 진열장 */}
      <ol className="container m-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(220px,max-content))] gap-2 p-2 pt-0 sm:gap-4 sm:p-4 sm:pt-0">
        {cart.products.map(({ item, quantity }, idx) => (
          <li
            key={item.id}
            className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40 transition-all duration-300 max-sm:dsy-card-side"
          >
            <figure>
              <Image
                src={item.images[0].src}
                alt={item.name}
                width={450}
                height={300}
                className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105 max-sm:h-full max-sm:w-40"
              />
            </figure>
            <div className="dsy-card-body gap-0">
              <span className="text-orange-500 max-sm:hidden">무료배송</span>
              <h2>{item.name}</h2>
              <p className="min-w-max">
                <ProductSalePercentage
                  isSale={item.isSale}
                  price={item.price}
                  salePrice={item.salePrice}
                />
                <ProductPrice //
                  isSale={item.isSale}
                  price={item.price}
                  salePrice={item.salePrice}
                />
                <ProductRegularPrice //
                  isSale={item.isSale}
                  price={item.price}
                />
              </p>
              <div className="dsy-card-actions mt-2">
                <div className="dsy-join">
                  <button
                    type="button"
                    className="dsy-btn-sm dsy-join-item dsy-btn flex-1 border-none bg-orange-100"
                    onClick={() => cart.setQuantity({ id: item.id, value: (prev) => prev - 1 })}
                  >
                    <FontAwesomeIcon icon={faCaretLeft} />
                  </button>
                  <input
                    type="number"
                    className="dsy-join-item w-10 text-center"
                    value={quantity}
                    onChange={(e) =>
                      cart.setQuantity({ id: item.id, value: parseInt(e.target.value) })
                    }
                  />
                  <button
                    type="button"
                    className="dsy-btn-sm dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
                    onClick={() => cart.setQuantity({ id: item.id, value: (prev) => prev + 1 })}
                  >
                    <FontAwesomeIcon icon={faCaretRight} />
                  </button>
                </div>
                <div className="flex-1"></div>
                <button
                  type="button"
                  className="dsy-btn-ghost dsy-btn-sm dsy-btn-circle dsy-btn"
                  onClick={() => cart.removeProduct(idx)}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-orange-300" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="container m-auto text-right">
        <div className="my-10 inline-block w-96 max-w-full overflow-hidden rounded-md p-4 text-start text-sm">
          <label htmlFor="total-price" className="flex p-2 px-6">
            <div>
              <FontAwesomeIcon icon={faBoxes} fontSize={14} /> 상품가격 :
            </div>
            <div className="flex-1 text-right">{totalProductPrice.toLocaleString() + "원"}</div>
          </label>
          <label htmlFor="total-price" className="flex p-2 px-6">
            <div>
              <FontAwesomeIcon icon={faLandmark} fontSize={14} /> 부가가치세 :
            </div>
            <div className="flex-1 text-right">{totalTaxPrice.toLocaleString() + "원"}</div>
          </label>
          <label htmlFor="total-price" className="flex p-2 px-6">
            <div>
              <FontAwesomeIcon icon={faWon} fontSize={14} /> 전체가격 :
            </div>
            <div className="flex-1 text-right">{totalPrice.toLocaleString() + "원"}</div>
          </label>
          <div className="dsy-join w-full p-2">
            <Link
              href="/user/shop"
              type="button"
              className="dsy-join-item dsy-btn flex-1 border-none bg-orange-100"
              onClick={() => cart.reset()}
            >
              <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
            </Link>
            <button
              type="button"
              className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
              onClick={() => router.push("payment")}
              disabled={cart.products.length === 0}
            >
              <FontAwesomeIcon icon={faCreditCard} /> 결제하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
