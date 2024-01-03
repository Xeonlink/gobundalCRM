import { DialogOpener } from "@/components/DialogOpener";
import { PageProps } from "@/extra/type";
import { faCartPlus, faCreditCard, faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { getProduct } from "./actions";
import Link from "next/link";

export default async function Page(props: PageProps<{ productId: string }>) {
  const id = props.params.productId;
  const product = await getProduct(+id);

  return (
    <main className="min-h-screen">
      {/* 상품정보 컨테이너 */}
      <div className="mx-2 my-6 flex max-w-max flex-wrap rounded-2xl bg-orange-50 p-4 shadow-lg sm:mx-auto">
        <div className="relative">
          <DialogOpener target="#big-image" className="sm:w-96">
            <Image
              src={product.images!?.[0]!.src}
              width={400}
              height={300}
              alt="이미지"
              className="rounded-lg"
            />
          </DialogOpener>
          <DialogOpener
            target="#big-image"
            className="dsy-btn dsy-btn-sm dsy-btn-circle absolute right-2 top-2 border-none bg-opacity-40 text-white"
          >
            <FontAwesomeIcon icon={faExpand} />
          </DialogOpener>
        </div>

        <div className="dsy-card-body gap-0 max-sm:p-4">
          <h2 className="text-lg">{product.name}</h2>
          <p className="">
            <span className="text-xl text-[#e63740] max-sm:text-lg">
              {product.isSale
                ? Math.round((1 - product.salePrice / product.price) * 100) + "%"
                : product.price === 0
                  ? "100%"
                  : ""}
            </span>{" "}
            <span className="text-xl font-bold max-sm:text-lg">
              {product.isSale
                ? product.salePrice.toLocaleString()
                : product.price === 0
                  ? "Free"
                  : product.price.toLocaleString()}
            </span>
            {product.price === 0 ? " " : "원 "}
            <span className="text-[#999999] line-through">
              {product.isSale && product.price.toLocaleString() + "원"}
            </span>
          </p>
          <div className="dsy-join w-full max-sm:hidden">
            <Link
              href={`/shop/${product.id}/tocart`}
              className="dsy-btn dsy-join-item min-w-max flex-1 border-none bg-orange-100"
              scroll={false}
            >
              <FontAwesomeIcon icon={faCartPlus} /> 장바구니
            </Link>
            <button
              type="button"
              className="dsy-btn dsy-join-item min-w-max flex-1 border-none bg-orange-200"
            >
              <FontAwesomeIcon icon={faCreditCard} /> 구매
            </button>
          </div>
        </div>
        <div className="dsy-join w-full sm:hidden">
          <DialogOpener
            target={`#product-count-to-cart-${product.id}`}
            className="dsy-btn dsy-join-item min-w-max flex-1 border-none bg-orange-100"
          >
            <FontAwesomeIcon icon={faCartPlus} /> 장바구니
          </DialogOpener>
          <button
            type="button"
            className="dsy-btn dsy-join-item min-w-max flex-1 border-none bg-orange-200"
          >
            <FontAwesomeIcon icon={faCreditCard} /> 구매
          </button>
        </div>
      </div>

      {/* 상세정보 컨테이너 */}
      <ul className="container m-auto flex flex-wrap justify-center gap-4 pb-8">
        {product.images.slice(1).map((item) => (
          <li key={item.id}>
            <Image
              src={item.src}
              alt="이미지"
              width={item.width}
              height={item.height}
              className="h-full w-full max-w-xl rounded-lg"
            />
          </li>
        ))}
      </ul>

      {/* 이미지 크게보기 모달 */}
      <dialog id="big-image" className="dsy-modal dsy-modal-top sm:dsy-modal-middle">
        <div className="dsy-modal-box p-0">
          <Image
            src={product.images[0].src}
            alt="이미지"
            width={product.images[0].width}
            height={product.images[0].height}
            className="h-full w-full rounded-lg"
          />
        </div>
        <form method="dialog" className="dsy-modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </main>
  );
}
