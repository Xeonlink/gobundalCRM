import { ProductPrice } from "@/components/ProductCard/ProductPrice";
import { ProductRegularPrice } from "@/components/ProductCard/ProductRegularPrice";
import { ProductSalePercentage } from "@/components/ProductCard/ProductSalePercentage";
import { PageProps } from "@/extra/type";
import { faCartPlus, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { getProductCategories } from "../action";
import { createCartProduct, getProductsByCategory } from "./actions";

export default async function Page(props: PageProps<{}, { category: string }>) {
  const categoryId = props.searchParams.category;
  const productCategories = await getProductCategories();
  const products = await getProductsByCategory(+categoryId);

  return (
    <main className="min-h-screen">
      {/* 카테고리 */}
      <ol className="container m-auto flex flex-wrap items-center justify-center gap-2 bg-white p-2 text-center text-sm">
        <li>
          <Link href="shop" className="dsy-btn">
            전체상품
          </Link>
        </li>
        {productCategories.map((item) => (
          <li key={item.id}>
            <Link replace href={`shop?category=${item.id}`} className="dsy-btn">
              {item.name}
            </Link>
          </li>
        ))}
      </ol>

      {/* 상품 진열장 */}
      <ol className="container m-auto mb-4 grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(220px,max-content))] justify-center gap-2 px-2 sm:gap-4 sm:px-4">
        {products.map((item) => (
          <li
            key={item.id}
            className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40 transition-all duration-300 max-sm:dsy-card-side"
          >
            <Link href={`shop/${item.id}`} className="contents">
              <figure>
                <Image
                  src={item.images[0].src}
                  alt={item.name}
                  width={450}
                  height={300}
                  className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105 max-sm:w-40"
                  priority
                />
              </figure>
              <div className="dsy-card-body gap-0">
                <span className="text-orange-500">무료배송</span>
                <h2>{item.name}</h2>
                <p className="min-w-max">
                  <ProductSalePercentage
                    isSale={item.isSale}
                    price={item.price}
                    salePrice={item.salePrice}
                  />
                  <ProductPrice
                    isSale={item.isSale}
                    price={item.price}
                    salePrice={item.salePrice}
                  />
                  <ProductRegularPrice isSale={item.isSale} price={item.price} />
                </p>
              </div>
            </Link>
            <div className="dsy-join w-full rounded-none max-sm:hidden">
              <Link
                href={`/shop/${item.id}/tocart`}
                className="dsy-btn dsy-join-item flex-1 border-none bg-orange-100"
                scroll={false}
              >
                <FontAwesomeIcon icon={faCartPlus} /> 장바구니
              </Link>
              <form className="contents">
                <button
                  formAction={createCartProduct.bind(null, item.id)}
                  className="dsy-btn dsy-join-item flex-1 border-none bg-orange-200"
                >
                  <FontAwesomeIcon icon={faCreditCard} /> 구매
                </button>
              </form>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
