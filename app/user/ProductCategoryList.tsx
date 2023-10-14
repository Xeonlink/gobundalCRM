"use client";

import { useProductCategories } from "@/api/product_categories";
import { NavLink } from "./NavLink";

export default function ProductCategoryList(props: { className?: string }) {
  const { className } = props;
  const category = useProductCategories();

  return (
    <ul className={className}>
      <li>
        <NavLink href="/user/shop?category=all">전체상품</NavLink>
      </li>
      {category?.data?.data.map((item) => (
        <li key={item.id}>
          <NavLink href={`/user/shop?category=${item.name}`}>{item.name}</NavLink>
        </li>
      ))}
    </ul>
  );
}
