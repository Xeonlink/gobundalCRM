"use client";

import { RawOrder, useCreateOrder } from "@/api/orders";
import { useProducts } from "@/api/products";
import { BlurInfo } from "@/components/BlurInfo";
import { CheckBox } from "@/components/CheckBox";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { cn, toHyphenPhone } from "@/extra/utils";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useToggle } from "@/hooks/useToggle";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  faAddressCard,
  faBox,
  faBoxesStacked,
  faBuilding,
  faEquals,
  faMobileScreenButton,
  faNotEqual,
  faPaperPlane,
  faSignature,
  faSignsPost,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

const defaultOrder: RawOrder = {
  senderName: "",
  senderPhone: "",
  sameAsSender: false,
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverAddressDetail: "",
  productName: "상품을 선택해주세요.",
  productPrice: 0,
  quantity: 1,
  memo: "",
};

export default function Page(_: PageProps) {
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      orderActions.setReceiverAddress(data.roadAddress);
    },
  });
  const senderInfo = useToggle(false);
  const initialInfo = useToggle(false);
  const productInfo = useToggle(false);
  const { data: products } = useProducts();
  const [order, orderActions] = useTypeSafeReducer(defaultOrder, {
    onSenderNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.senderName = e.target.value;
    },
    onSenderPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.senderPhone = toHyphenPhone(e.target.value);
    },
    toggleSameAsSender: (state) => {
      state.sameAsSender = !state.sameAsSender;
    },
    onReceiverNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.receiverName = e.target.value;
    },
    onReceiverPhoneChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.receiverPhone = toHyphenPhone(e.target.value);
    },
    setReceiverAddress: (state, receiverAddress: string) => {
      state.receiverAddress = receiverAddress;
    },
    onReceiverAddressDetailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.receiverAddressDetail = e.target.value;
    },
    onProductChange: (state, e: React.ChangeEvent<HTMLSelectElement>) => {
      const product = products?.data.find((p) => p.id === e.target.value);
      state.productName = product?.name || "상품을 선택해주세요.";
      state.productPrice = product?.price || 0;
    },
    reset: (_) => {
      return defaultOrder;
    },
  });

  const finalOrder: RawOrder = {
    ...order,
    receiverName: order.sameAsSender ? order.senderName : order.receiverName,
    receiverPhone: order.sameAsSender ? order.senderPhone : order.receiverPhone,
  };

  const validity = {
    senderName: finalOrder.senderName.length > 0,
    senderPhone: finalOrder.senderPhone.length > 0,
    receiverName: finalOrder.receiverName.length > 0,
    receiverPhone: finalOrder.receiverPhone.length > 0,
    receiverAddress: finalOrder.receiverAddress.length > 0,
    receiverAddressDetail: finalOrder.receiverAddressDetail.length > 0,
    productName: finalOrder.productName !== "상품을 선택해주세요.",
  };

  const isRegistBtnValid = Object.values(validity).every((v) => v);

  const createOrder = useCreateOrder(finalOrder, {
    onSuccess: () => {
      alert("배송정보 등록이 완료되었습니다.");
      if (confirm("추가로 등록하시겠습니까?")) {
        orderActions.onProductChange({ target: { value: "기타" } } as any);
        return;
      }
      orderActions.reset();
    },
  });

  return (
    <div className='p-3 m-auto max-w-full'>
      <h1 className='text-3xl text-center py-8 font-bold'>택배 정보</h1>

      <form action='' onSubmit={(e) => e.preventDefault()}>
        <div className='flex gap-3 justify-evenly flex-wrap items-start'>
          <fieldset className='fieldset'>
            <legend className='btn text-lg bg-transparent p-2' onClick={senderInfo.toggle}>
              <FaIcon icon={faPaperPlane} fontSize={16} />
              &nbsp;보내는 사람&nbsp;
              <FaIcon icon={faCircleQuestion} fontSize={16} />
            </legend>

            <BlurInfo open={senderInfo.isOn} closeFn={senderInfo.toggle}>
              실제 배송정보에는 필요하지 않으나, <br />
              택배사고 발생 시 연락을 위해 <br />
              입력해주세요.
            </BlurInfo>

            <div className='field'>
              <label htmlFor='sender-name' className='label'>
                <FaIcon icon={faSignature} /> 이름
              </label>
              <Input
                id='sender-name'
                placeholder='홍길동'
                disabled={createOrder.isLoading}
                value={order.senderName}
                onChange={orderActions.onSenderNameChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='sender-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <Input
                id='sender-phone'
                type='tel'
                placeholder='010-xxxx-xxxx'
                disabled={createOrder.isLoading}
                value={order.senderPhone}
                onChange={orderActions.onSenderPhoneChange}
                required
              />
            </div>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='text-lg m-box p-2 text-center bg-transparent'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 받는 사람
            </legend>

            <div className='field'>
              <label htmlFor='same-as-sender' className='label'>
                <FaIcon icon={faPaperPlane} /> 보내는 사람과
              </label>
              <CheckBox
                checked={order.sameAsSender}
                disable={createOrder.isLoading}
                toggleFn={orderActions.toggleSameAsSender}
                trueContents={[faEquals, " 동일"]}
                falseContents={[faNotEqual, " 동일하지 않음"]}
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-name' className='label'>
                <FaIcon icon={faSignature} /> 이름
              </label>
              <Input
                id='receiver-name'
                placeholder='홍길동'
                disabled={order.sameAsSender || createOrder.isLoading}
                value={order.sameAsSender ? order.senderName : order.receiverName}
                onChange={orderActions.onReceiverNameChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <Input
                id='receiver-phone'
                placeholder='010-xxxx-xxxx'
                disabled={order.sameAsSender || createOrder.isLoading}
                value={order.sameAsSender ? order.senderPhone : order.receiverPhone}
                onChange={orderActions.onReceiverPhoneChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-address' className='label'>
                <FaIcon icon={faSignsPost} /> 주소
              </label>
              <Input
                id='receiver-address'
                placeholder='남원월산로74번길 42'
                disabled={createOrder.isLoading}
                value={order.receiverAddress}
                onChange={postCodePopup.show}
                onClick={postCodePopup.show}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-address-detail' className='label'>
                <FaIcon icon={faBuilding} /> 상세주소
              </label>
              <Input
                id='receiver-address-detail'
                placeholder='단독주택, 1층 101호, ...'
                disabled={createOrder.isLoading}
                value={order.receiverAddressDetail}
                onChange={orderActions.onReceiverAddressDetailChange}
                required
              />
            </div>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='text-lg m-box p-2 text-center bg-transparent'>
              <FaIcon icon={faBoxesStacked} /> 배송물품
            </legend>

            <BlurInfo open={productInfo.isOn} closeFn={productInfo.toggle}>
              묶음 배송은 10kg까지만 가능합니다. <br />
              배송해야할 상품이 많은 경우, <br />
              배송정보을 나눠서 작성하셔야합니다. <br />
            </BlurInfo>

            <BlurInfo open={initialInfo.isOn} closeFn={initialInfo.toggle}>
              다른 손님의 택배와 구분하고, <br />
              오배송을 줄이기 위해, <br />
              박스에 이니셜을 적어주세요. <br />
            </BlurInfo>

            <div className='field'>
              <label
                className='btn label bg-transparent shadow-none text-start'
                onClick={productInfo.toggle}
              >
                <FaIcon icon={faBox} /> 상품선택 <FaIcon icon={faCircleQuestion} />
              </label>
              <select
                name='product-name'
                id='product-name'
                className={cn("rounded-md bg-white px-3 py-2 w-full disabled:opacity-40", {
                  "animate-shake border-red-300 border-2": !validity.productName,
                })}
                disabled={createOrder.isLoading}
                value={
                  products?.data.find((item) => item.id === order.productName)?.id ||
                  "상품을 선택해주세요."
                }
                onChange={orderActions.onProductChange}
                required
              >
                <option value='상품을 선택해주세요.'>상품을 선택해주세요.</option>
                {products?.data
                  .filter((item) => item.enabled)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
          </fieldset>
        </div>

        <div className='mb-10 text-center'>
          <button
            type='button'
            className='btn py-2 mb-3 w-56 max-w-full'
            disabled={!isRegistBtnValid || createOrder.isLoading}
            onClick={() => createOrder.mutate()}
          >
            {createOrder.isLoading ? (
              <>
                <FaIcon icon={faSpinner} className='animate-spin' /> 배송정보 등록중...
              </>
            ) : (
              <>
                <FaIcon icon={faAddressCard} /> 배송정보 등록
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
