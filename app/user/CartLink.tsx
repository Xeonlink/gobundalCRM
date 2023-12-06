"use client";

import { useCart } from "@/hooks/useCart";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function CartLink() {
  const 상품종류수 = useCart((state) => state.products.length);
  const 전체가격 = useCart((state) =>
    state.products
      .map(({ item, quantity }) => (item.isSale ? item.salePrice : item.price) * quantity)
      .reduce((acc, cur) => acc + cur, 0),
  );

  return (
    <div className="dsy-dropdown-end dsy-dropdown">
      <label tabIndex={0} className="dsy-btn-ghost dsy-btn">
        <div className="dsy-indicator">
          <FontAwesomeIcon icon={faCartShopping} fontSize={16} />
          <span className="dsy-badge dsy-badge-sm dsy-indicator-item">{상품종류수}</span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="dsy-card dsy-dropdown-content dsy-card-compact z-[1] mt-3 w-52 bg-base-100 shadow"
      >
        <div className="dsy-card-body">
          <span className="text-lg font-bold">상품 {상품종류수}종류</span>
          <span className="text-info">가격: {전체가격.toLocaleString()}원</span>
          <div className="dsy-card-actions">
            <Link href="/user/cart" className="dsy-btn-primary dsy-btn-block dsy-btn">
              장바구니 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
