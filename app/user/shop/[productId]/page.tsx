"use client";

import { useProduct } from "@/api/products";
import { PageProps } from "@/extra/type";
import { useCart } from "@/hooks/useCart";
import Img상품상세정보 from "@/public/images/prouct_detail.jpg";
import { faCartPlus, faCreditCard, faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function Page(props: PageProps<{ productId: string }>) {
  const { params } = props;
  const { productId } = params;
  const { data: product } = useProduct(productId);
  const cart = useCart();

  const openBigImgDialog = () => {
    (document.querySelector("#big-image") as HTMLDialogElement)?.showModal();
  };

  return (
    <main>
      {/* 상품정보 컨테이너 */}
      <div className="mx-2 my-6 flex max-w-max flex-wrap rounded-2xl bg-orange-50 p-4 shadow-lg sm:mx-auto">
        <div className="relative">
          <button type="button" className="sm:w-96" onDoubleClick={openBigImgDialog}>
            <Image
              src={product?.imgSrc!}
              width={400}
              height={300}
              alt="이미지"
              className="rounded-lg"
            />
          </button>
          <button
            type="button"
            className="dsy-btn-sm dsy-btn-circle dsy-btn absolute right-2 top-2 border-none bg-opacity-40 text-white"
            onClick={openBigImgDialog}
          >
            <FontAwesomeIcon icon={faExpand} />
          </button>
        </div>

        <div className="dsy-card-body gap-0 max-sm:p-4">
          <h2 className="text-lg">{product?.name}</h2>
          <p className="">
            <span className="text-xl text-[#e63740] max-sm:text-lg">
              {product?.isSale
                ? Math.round((1 - product?.salePrice / product?.price) * 100) + "%"
                : product?.price === 0
                ? "100%"
                : ""}
            </span>{" "}
            <span className="text-xl font-bold max-sm:text-lg">
              {product?.isSale
                ? product?.salePrice.toLocaleString()
                : product?.price === 0
                ? "Free"
                : product?.price.toLocaleString()}
            </span>
            {product?.price === 0 ? " " : "원 "}
            <span className="text-[#999999] line-through">
              {product?.isSale && product?.price.toLocaleString() + "원"}
            </span>
          </p>
          <div className="dsy-join w-full max-sm:hidden">
            <button
              type="button"
              className="dsy-join-item dsy-btn min-w-max flex-1 border-none bg-orange-100"
              onClick={() => cart.setCandidate(product!)}
            >
              <FontAwesomeIcon icon={faCartPlus} /> 장바구니
            </button>
            <button
              type="button"
              className="dsy-join-item dsy-btn min-w-max flex-1 border-none bg-orange-200"
            >
              <FontAwesomeIcon icon={faCreditCard} /> 구매
            </button>
          </div>
        </div>
        <div className="dsy-join w-full sm:hidden">
          <button
            type="button"
            className="dsy-join-item dsy-btn min-w-max flex-1 border-none bg-orange-100"
            onClick={() => cart.setCandidate(product!)}
          >
            <FontAwesomeIcon icon={faCartPlus} /> 장바구니
          </button>
          <button
            type="button"
            className="dsy-join-item dsy-btn min-w-max flex-1 border-none bg-orange-200"
          >
            <FontAwesomeIcon icon={faCreditCard} /> 구매
          </button>
        </div>
      </div>

      {/* 상세정보 컨테이너 */}
      <div className="container m-auto text-center">
        <Image src={Img상품상세정보} alt="상품 상세정보" className="inline-block" />
      </div>

      {/* 이미지 크게보기 모달 */}
      <dialog id="big-image" className="dsy-modal dsy-modal-top sm:dsy-modal-middle">
        <div className="dsy-modal-box p-0">
          <img src={product?.imgSrc!} alt="이미지" className="h-full w-full rounded-lg" />
        </div>
        <form method="dialog" className="dsy-modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </main>
  );
}
