import { ProductPrice } from "@/components/ProductCard/ProductPrice";
import { ProductRegularPrice } from "@/components/ProductCard/ProductRegularPrice";
import { ProductSalePercentage } from "@/components/ProductCard/ProductSalePercentage";
import Img블로그광고 from "@/public/images/blog_ads.jpg";
import Img수산물 from "@/public/images/fishes.jpg";
import Img수제상품 from "@/public/images/hand_made_product.jpg";
import ImgHello2 from "@/public/images/hello2.jpeg";
import Img배송현황 from "@/public/images/shipping_stataus.jpg";
import { faCartPlus, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { getRandomCategoryWithProducts, getRecommandedProducts } from "./action";
import { ProductName } from "@/components/ProductCard/ProductName";

export default async function Page() {
  const recommandedProducts = await getRecommandedProducts();
  const randomCategory = await getRandomCategoryWithProducts();

  return (
    <main>
      <div
        className="dsy-hero h-[450px]"
        style={{ backgroundImage: `url(${ImgHello2.src})`, backgroundPosition: "top" }}
      >
        <div className="dsy-hero-overlay bg-opacity-60"></div>
        <div className="dsy-hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">곱은달농장</h1>
            <p className="mb-5">곱은달농장은 농부의 마음으로 청정지역의 농산물을 선물합니다.</p>
            <Link href="/user/shop" className="dsy-btn-primary dsy-btn">
              상품 둘러보기
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-20 flex flex-col">
        <h2 className="py-10 text-center text-3xl font-bold">추천 상품</h2>
        <ul className="dsy-carousel-center dsy-carousel justify-center space-x-4 p-4">
          {recommandedProducts.map((item) => (
            <li className="dsy-carousel-item" key={item.id}>
              <Link
                href={`/user/shop/${item.id}`}
                key={item.id}
                className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40"
              >
                <figure>
                  <Image
                    src={item.images[0].src}
                    alt={item.name}
                    width={240}
                    height={160}
                    className="aspect-[3/2] object-cover transition-all duration-300 hover:scale-105"
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
                <div className="dsy-join w-full rounded-none">
                  <button
                    type="button"
                    className="dsy-join-item dsy-btn flex-1 border-none bg-orange-100"
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
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/user/shop" className="dsy-btn m-auto">
          전체보기
        </Link>
      </div>

      <ul className="flex flex-wrap justify-center bg-base-200 py-10 max-sm:p-4">
        <li>
          <ul className="flex justify-center">
            <li>
              <a href="#">
                <Image src={Img수산물} alt="수산물 쇼핑으로 이동" />
              </a>
            </li>
            <li>
              <a href="#">
                <Image src={Img수제상품} alt="수제상품 쇼핑으로 이동" />
              </a>
            </li>
          </ul>
        </li>
        <li>
          <ul className="flex justify-center">
            <li>
              <a href="#">
                <Image src={Img블로그광고} alt="블로그로 이동" />
              </a>
            </li>
            <li>
              <a href="#">
                <Image src={Img배송현황} alt="배송현황으로 이동" />
              </a>
            </li>
          </ul>
        </li>
      </ul>

      {randomCategory !== null && (
        <div className="mb-20 flex flex-col">
          <h2 className="py-10 text-center text-3xl font-bold">{randomCategory.name}</h2>
          <ul className="dsy-carousel-center dsy-carousel justify-center space-x-4 p-4">
            {randomCategory.products.map((item) => (
              <li className="dsy-carousel-item" key={item.id}>
                <Link
                  href={`/user/shop/${item.id}`}
                  key={item.id}
                  className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40"
                >
                  <figure>
                    <Image
                      src={item.images[0].src}
                      alt={item.name}
                      width={240}
                      height={160}
                      className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105"
                    />
                  </figure>
                  <div className="dsy-card-body gap-0">
                    <span className="text-orange-500">무료배송</span>
                    <ProductName product={item} />
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
                  <div className="dsy-join w-full rounded-none">
                    <button
                      type="button"
                      className="dsy-join-item dsy-btn flex-1 border-none bg-orange-100"
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
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`/user/shop?category=${randomCategory.id}`} className="dsy-btn m-auto">
            전체보기
          </Link>
        </div>
      )}
    </main>
  );
}
