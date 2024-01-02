import { ProductPrice } from "@/components/ProductCard/ProductPrice";
import { ProductRegularPrice } from "@/components/ProductCard/ProductRegularPrice";
import { ProductSalePercentage } from "@/components/ProductCard/ProductSalePercentage";
import {
  faArrowsRotate,
  faBoxes,
  faCreditCard,
  faLandmark,
  faNotdef,
  faTrash,
  faWon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import {
  deleteCartProduct,
  getCartProducts,
  resetCartProducts,
  setCartProductQuantity,
} from "./actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    redirect("/user/signin?callbackurl=/user/cart");
  }

  const cartProducts = await getCartProducts();

  const totalProductPrice = cartProducts.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const totalTaxPrice = totalProductPrice / 10;
  const totalPrice = totalProductPrice + totalTaxPrice;

  return (
    <main className="min-h-screen">
      <h2 className="py-6 text-center text-3xl font-bold">장바구니</h2>

      {/* 상품 진열장 */}
      <ol className="container m-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(220px,max-content))] justify-center gap-2 p-2 pt-0 sm:gap-4 sm:p-4 sm:pt-0">
        {cartProducts.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="dsy-card dsy-card-compact animate-scaleTo1 overflow-hidden rounded-lg bg-orange-100 bg-opacity-40 transition-all duration-300 max-sm:dsy-card-side"
          >
            <figure>
              <Image
                src={product.images[0].src}
                alt={product.name}
                width={450}
                height={300}
                className="aspect-[3/2] cursor-pointer object-cover transition-all duration-300 hover:scale-105 max-sm:h-full max-sm:w-40"
              />
            </figure>
            <div className="dsy-card-body gap-0">
              <span className="text-orange-500 max-sm:hidden">무료배송</span>
              <h2>{product.name}</h2>
              <p className="min-w-max">
                <ProductSalePercentage
                  isSale={product.isSale}
                  price={product.price}
                  salePrice={product.salePrice}
                />
                <ProductPrice //
                  isSale={product.isSale}
                  price={product.price}
                  salePrice={product.salePrice}
                />
                <ProductRegularPrice //
                  isSale={product.isSale}
                  price={product.price}
                />
              </p>
              <form className="dsy-card-actions mt-2">
                <div className="dsy-join">
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    className="dsy-join-item w-20 text-center"
                    defaultValue={quantity}
                  />
                  <button
                    className="dsy-btn dsy-btn-sm dsy-join-item border-none bg-orange-200"
                    formAction={setCartProductQuantity.bind(null, product.id)}
                  >
                    <FontAwesomeIcon icon={faArrowsRotate} /> 변경
                  </button>
                </div>
                <div className="flex-1"></div>
                <button
                  className="dsy-btn-ghost dsy-btn dsy-btn-sm dsy-btn-circle"
                  formAction={deleteCartProduct.bind(null, product.id)}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-orange-300" />
                </button>
              </form>
            </div>
          </li>
        ))}
      </ol>

      <div className="container m-auto text-right">
        <form className="my-10 inline-block w-96 max-w-full overflow-hidden rounded-md p-4 text-start text-sm">
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
            <button
              className="dsy-btn dsy-join-item flex-1 border-none bg-orange-100"
              formAction={resetCartProducts}
            >
              <FontAwesomeIcon icon={faNotdef} rotation={90} /> 초기화
            </button>
            <Link
              href="payment"
              className="dsy-btn dsy-join-item flex-1 border-none bg-orange-200 aria-disabled:dsy-btn-disabled"
              aria-disabled={cartProducts.length === 0}
            >
              <FontAwesomeIcon icon={faCreditCard} /> 결제하기
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
