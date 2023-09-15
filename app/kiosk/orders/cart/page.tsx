"use client";

import { useCart } from "@/hooks/useCart";
import {
  faBox,
  faBoxes,
  faCreditCard,
  faLandmark,
  faNotdef,
  faPlusMinus,
  faTrashCan,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Page() {
  const cart = useCart();
  const { products: cartProducts } = cart;

  const totalProductPrice = cartProducts.reduce((acc, { item, quantity }) => {
    return acc + (item.isSale ? item.salePrice : item.price) * quantity;
  }, 0);
  const totalTaxPrice = Math.round(totalProductPrice * 0.1);
  const totalPrice = totalProductPrice + totalTaxPrice;

  return (
    <div className="container mx-auto space-y-2 p-2">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-max text-sm max-sm:hidden">
          <thead>
            <tr>
              <th className="pl-3 text-start font-normal">
                <FaIcon icon={faBox} /> 상품
              </th>
              <th className="text-start font-normal">
                <FaIcon icon={faWon} /> 단가
              </th>
              <th className="text-start font-normal">
                <FaIcon icon={faPlusMinus} /> 수량
              </th>
              <th className="text-start font-normal">
                <FaIcon icon={faWon} /> 가격
              </th>
              <th className="text-start font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {cartProducts.map(({ item, quantity }, idx) => (
              <tr className="even:bg-white even:bg-opacity-40" key={item.id}>
                <td className="py-2 pl-2 pr-2 first-of-type:rounded-l-md last-of-type:rounded-r-md">
                  <figure className="mr-2 inline-block w-28 align-middle">
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="rounded-md object-cover object-center"
                    />
                  </figure>
                  <span>{item.name}</span>
                </td>
                <td className="min-w-fit py-2 pr-2 first-of-type:rounded-l-md last-of-type:rounded-r-md">
                  <div className="flex min-w-max gap-2 max-md:flex-col max-md:gap-1">
                    <span className="min-w-fit text-[#e63740]">
                      {item.isSale
                        ? Math.round((1 - item.salePrice / item.price) * 100) + "%"
                        : item.price === 0
                        ? "100%"
                        : ""}
                    </span>
                    <span className="min-w-fit">
                      <span className="font-bold">
                        {item.isSale
                          ? item.salePrice.toLocaleString()
                          : item.price === 0
                          ? "Free"
                          : item.price.toLocaleString()}
                      </span>
                      {item.price === 0 ? " " : "원 "}
                    </span>
                    <span className="min-w-fit text-sm text-[#999999] line-through">
                      {((item.isSale ? item.salePrice : item.price) * 5).toLocaleString() + "원"}
                    </span>
                  </div>
                </td>
                <td className="py-2 pr-2 first-of-type:rounded-l-md last-of-type:rounded-r-md">
                  <div className="dsy-join">
                    <button
                      type="button"
                      className="dsy-btn-outline dsy-btn-sm dsy-btn"
                      onClick={() => cart.decreaseQuantity(idx)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-10 bg-transparent text-center"
                      value={quantity}
                    />
                    <button
                      type="button"
                      className="dsy-btn-outline dsy-btn-sm dsy-btn"
                      onClick={() => cart.increaseQuantity(idx)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-2 pr-2 first-of-type:rounded-l-md last-of-type:rounded-r-md">
                  <span className="min-w-max">
                    <span className="font-bold">
                      {item.isSale
                        ? (item.salePrice * quantity).toLocaleString()
                        : item.price === 0
                        ? "Free"
                        : (item.price * quantity).toLocaleString()}
                    </span>
                    {item.price === 0 ? " " : "원 "}
                  </span>
                </td>
                <td className="py-2 first-of-type:rounded-l-md last-of-type:rounded-r-md last-of-type:pr-2">
                  <button
                    type="button"
                    className="dsy-btn-outline dsy-btn-sm dsy-btn"
                    onClick={() => cart.removeProduct(idx)}
                  >
                    <FaIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="sm:hidden">
          {cartProducts.map(({ item, quantity }, idx) => (
            <li
              className="dsy-card dsy-card-side h-28 even:bg-white even:bg-opacity-40"
              key={item.id}
            >
              <figure className="w-1/3 p-2">
                <img src={item.imgSrc} alt={item.name} className="h-full w-full rounded-lg" />
              </figure>
              <div className="dsy-card-body p-6">
                <h2 className="dsy-card-title text-lg">{item.name}</h2>

                <p className="flex">
                  <div className="dsy-join">
                    <button
                      type="button"
                      className="dsy-btn-sm dsy-join-item dsy-btn"
                      onClick={() => cart.decreaseQuantity(idx)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="dsy-join-item w-10 text-center"
                      value={quantity}
                    />
                    <button
                      type="button"
                      className="dsy-btn-sm dsy-join-item dsy-btn"
                      onClick={() => cart.increaseQuantity(idx)}
                    >
                      +
                    </button>
                  </div>
                  <span className="flex-1 text-end">
                    {item.isSale
                      ? (item.salePrice * quantity).toLocaleString()
                      : item.price === 0
                      ? "Free"
                      : (item.price * quantity).toLocaleString()}
                  </span>
                  {item.price === 0 ? " " : "원 "}
                </p>
              </div>

              <button
                type="button"
                className="absolute right-6 top-6"
                onClick={() => cart.removeProduct(idx)}
              >
                <FaIcon icon={faTrashCan} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-right">
        <div className="inline-block w-96 max-w-full overflow-hidden rounded-md bg-white bg-opacity-40 p-4 text-start">
          <label htmlFor="total-price" className="flex p-2">
            <div>
              <FaIcon icon={faBoxes} fontSize={14} /> 상품가격 :
            </div>
            <div className="flex-1 text-right">{totalPrice.toLocaleString() + "원"}</div>
          </label>
          <label htmlFor="total-price" className="flex p-2">
            <div>
              <FaIcon icon={faLandmark} fontSize={14} /> 부가가치세 :
            </div>
            <div className="flex-1 text-right">{totalTaxPrice.toLocaleString() + "원"}</div>
          </label>
          <label htmlFor="total-price" className="flex p-2">
            <div>
              <FaIcon icon={faWon} fontSize={14} /> 전체가격 :
            </div>
            <div className="flex-1 text-right">{totalPrice.toLocaleString() + "원"}</div>
          </label>
          <div className="dsy-join w-full p-2">
            <Link
              href="./products"
              type="button"
              className="dsy-join-item dsy-btn flex-1 border-none bg-white"
              onClick={() => cart.reset()}
            >
              <FaIcon icon={faNotdef} rotation={90} /> 초기화
            </Link>
            <Link
              href="./payment"
              type="button"
              className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
            >
              <FaIcon icon={faCreditCard} /> 구매
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
