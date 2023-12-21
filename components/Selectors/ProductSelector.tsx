"use client";

import { useProducts } from "@/app/api/products/accessors";
import {
  faBox,
  faBoxes,
  faCheck,
  faCoins,
  faInfinity,
  faSignature,
  faSliders,
  faToggleOn,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "@prisma/client";

type Props = {
  onSelect?: (item: Product) => void;
};

export function ProductSelector(props: Props) {
  const { data: products } = useProducts();

  return (
    <dialog id="product-selector" className="dsy-modal">
      <form method="dialog" className="dsy-modal-box max-w-none">
        <table className="table">
          <thead>
            <tr>
              <th className="rounded-tl-md bg-orange-100" colSpan={4}>
                <FontAwesomeIcon icon={faBox} /> 상품
              </th>
              <th className="rounded-tr-md bg-green-100" colSpan={3}>
                <FontAwesomeIcon icon={faSliders} /> 상태
              </th>
            </tr>
            <tr>
              <th className="rounded-bl-md bg-orange-50">
                <FontAwesomeIcon icon={faSignature} /> 이름
              </th>
              <th className="bg-orange-50">
                <FontAwesomeIcon icon={faWon} /> 가격
              </th>
              <th className="bg-orange-50">
                <FontAwesomeIcon icon={faWon} /> 할인가격
              </th>
              <th className="bg-orange-50">
                <FontAwesomeIcon icon={faBoxes} /> 재고
              </th>
              <th className="bg-green-50">
                <FontAwesomeIcon icon={faCoins} /> 할인중
              </th>
              <th className=" bg-green-50">
                <FontAwesomeIcon icon={faToggleOn} /> 활성화
              </th>
              <th className=" rounded-br-md bg-green-50">
                <FontAwesomeIcon icon={faCheck} /> 선택
              </th>
            </tr>
          </thead>
          <tbody>
            {products!.map((item) => (
              <tr key={item.id}>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faSignature} /> 이름
                  </label>
                  <span>{item.name}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faWon} /> 가격
                  </label>
                  <span>{item.price.toLocaleString() + "원"}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faWon} /> 할인가격
                  </label>
                  <span>{item.salePrice.toLocaleString() + "원"}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faBoxes} /> 재고
                  </label>
                  <span>
                    {item.remain < 0 ? <FontAwesomeIcon icon={faInfinity} /> : item.remain}
                  </span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faCoins} /> 할인중
                  </label>
                  <span>{item.isSale ? "O" : "X"}</span>
                </td>
                <td>
                  <label>
                    <FontAwesomeIcon icon={faToggleOn} /> 활성화
                  </label>
                  <span>{item.enabled ? "O" : "X"}</span>
                </td>
                <td>
                  <button className="dsy-btn-sm dsy-btn" onClick={() => props.onSelect?.(item!)}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      <form method="dialog" className="dsy-modal-backdrop">
        <button>{/* Close */}</button>
      </form>
    </dialog>
  );
}
