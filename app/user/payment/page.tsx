"use client";

import { Input } from "@/components/Input";
import { useCart } from "@/hooks/useCart";
import {
  faBox,
  faBoxes,
  faCreditCard,
  faLandmark,
  faNotdef,
  faPlusMinus,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const cart = useCart();

  const totalPrice = 100000000;
  const totalTaxPrice = 100000;

  return (
    <main className="bg-base-100">
      <h2 className="py-6 text-center text-3xl font-bold">결제정보</h2>

      <section className="container m-auto max-w-4xl px-2">
        <h3 className="flex items-center p-2">
          <span className="flex-1 text-lg font-bold">보내는 사람</span>
        </h3>
        <table className="block w-full rounded-md border-[1px] text-sm">
          <tbody className="block w-full">
            <tr className="flex w-full">
              <td className="w-20 rounded-tl-md border-[1px] bg-base-200 p-2 sm:w-32">이름</td>
              <td className="flex-1 rounded-tr-md border-[1px] p-2">
                <Input className="w-full max-w-[182px] text-center" />
              </td>
            </tr>
            <tr className="flex w-full">
              <td className="w-20 rounded-bl-md border-[1px] bg-base-200 p-2 sm:w-32">전화번호</td>
              <td className="flex-1 rounded-br-md border-[1px] p-2">
                <Input className="w-full max-w-[182px] text-center" />
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="flex items-center p-2">
          <span className="flex-1 text-lg font-bold">받는 사람</span>
          <span className="mr-2 text-sm">보내는 사람과 동일</span>
          <input
            type="checkbox"
            name="same-as-sender"
            id="same-as-sender"
            className="dsy-toggle-success dsy-toggle"
            // checked={order.sameAsSender}
            // onChange={orderActions.toggleSameAsSender}
          />
        </h3>
        <table className="block w-full rounded-md border-[1px] text-sm">
          <tbody className="block w-full">
            <tr className="flex w-full border-b-[1px] last:border-none">
              <td className="w-20 rounded-tl-md bg-base-200 p-2 sm:w-32">이름</td>
              <td className="flex-1 rounded-tr-md p-2">
                <Input className="w-full max-w-[182px] text-center" />
              </td>
            </tr>
            <tr className="flex w-full border-b-[1px] last:border-none">
              <td className="w-20 bg-base-200 p-2 sm:w-32">전화번호</td>
              <td className="flex-1 p-2">
                <Input className="w-full max-w-[182px] text-center" />
              </td>
            </tr>
            <tr className="flex w-full border-b-[1px] last:border-none">
              <td className="w-20 bg-base-200 p-2 sm:w-32">주소</td>
              <td className="flex-1 p-2">
                <Input className="w-full max-w-[182px] text-center" />
              </td>
            </tr>
            <tr className="flex w-full border-b-[1px] last:border-none">
              <td className="w-20 rounded-bl-md bg-base-200 p-2 sm:w-32">상세주소</td>
              <td className="flex-1 rounded-br-md p-2">
                <Input className="w-full max-w-[182px] text-center" />
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-4 flex items-center p-2 sm:hidden">
          <span className="flex-1 text-lg font-bold">배송상품</span>
        </h3>
        <table className="dsy-table w-full min-w-max text-sm sm:mt-4">
          <thead className="max-sm:hidden">
            <tr>
              <th>
                <FontAwesomeIcon icon={faBox} /> 상품
              </th>
              <th>
                <FontAwesomeIcon icon={faWon} /> 단가
              </th>
              <th>
                <FontAwesomeIcon icon={faPlusMinus} /> 수량
              </th>
              <th>
                <FontAwesomeIcon icon={faWon} /> 가격
              </th>
            </tr>
          </thead>
          <tbody>
            {cart.products.map(({ item, quantity }, idx) => (
              <tr key={item.id}>
                <td className="max-sm:px-0">
                  <figure className="mr-2 inline-block w-28 align-middle">
                    <Image
                      src={item.images[0].src}
                      alt={item.name}
                      width={item.images[0].width}
                      height={item.images[0].height}
                      className="rounded-md object-cover object-center"
                    />
                  </figure>
                  <span className="max-sm:hidden">{item.name}</span>
                </td>
                <td>
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
                <td>{quantity}</td>
                <td className="max-sm:hidden">
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
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-full text-end">
          <div className="my-10 inline-block w-96 max-w-full overflow-hidden rounded-md p-4 text-start text-sm">
            <label htmlFor="total-price" className="flex p-2 px-6">
              <div>
                <FontAwesomeIcon icon={faBoxes} fontSize={14} /> 상품가격 :
              </div>
              <div className="flex-1 text-right">{totalPrice.toLocaleString() + "원"}</div>
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
                // onClick={() => cart.reset()}
              >
                <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
              </Link>
              <Link
                href="./payment"
                type="button"
                className="dsy-join-item dsy-btn flex-1 border-none bg-orange-200"
              >
                <FontAwesomeIcon icon={faCreditCard} /> 결제하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
