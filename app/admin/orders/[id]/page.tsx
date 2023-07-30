"use client";

import { useCustomersByName } from "@/api/customers";
import { RawOrder, useCreateOrder, useOrder, useOrders } from "@/api/orders";
import { useProducts } from "@/api/products";
import { BlurInfo } from "@/components/BlurInfo";
import { CheckBox } from "@/components/CheckBox";
import { Input } from "@/components/Input";
import { PageProps } from "@/extra/type";
import { toHyphenPhone } from "@/extra/utils";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { usePostCodePopup } from "@/hooks/usePostCodePopup";
import { useToggle } from "@/hooks/useToggle";
import { useTypeSafeReducer } from "@/hooks/useTypeSafeReducer";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faBox,
  faBoxesStacked,
  faBuilding,
  faCalculator,
  faCoins,
  faEquals,
  faFloppyDisk,
  faMobileScreenButton,
  faNotEqual,
  faNotdef,
  faPaperPlane,
  faPlus,
  faSignature,
  faSignsPost,
  faSpinner,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

type Params = { id: string };

export default function Page(props: PageProps<Params>) {
  const { params } = props;

  useAuth();
  const navigate = useRouter();
  const senderInfo = useToggle(false);
  const order = useOrder(params.id);
  const [change, changeActions] = useTypeSafeReducer(order.data!, {
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
    addProduct: (
      state,
      product: { name: string; price: number; quantity: number } = {
        name: "",
        price: 0,
        quantity: 1,
      }
    ) => {
      state.products.splice(0, 0, product);
    },
    removeProduct: (state, index: number) => {
      state.products.splice(index, 1);
    },
    setProductName: (state, { index, name }: { index: number; name: string }) => {
      state.products[index].name = name;
    },
    setProductPrice: (state, { index, price }: { index: number; price: number }) => {
      state.products[index].price = price;
    },
    setQuantity: (state, { index, quantity }: { index: number; quantity: number }) => {
      state.products[index].quantity = quantity;
    },
    onMemoChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.memo = e.target.value;
    },
    reset: (_) => {
      return order.data!;
    },
  });
  const finalOrder: RawOrder = {
    ...change,
    receiverName: change.sameAsSender ? change.senderName : change.receiverName,
    receiverPhone: change.sameAsSender ? change.senderPhone : change.receiverPhone,
  };
  const debouncedSenderName = useDebounce(change.senderName, 500);
  const customers = useCustomersByName(debouncedSenderName);
  const { data: products } = useProducts();

  const validity = {
    senderName: finalOrder.senderName.length > 0,
    senderPhone: finalOrder.senderPhone.length > 0,
    receiverName: finalOrder.receiverName.length > 0,
    receiverPhone: finalOrder.receiverPhone.length > 0,
    receiverAddress: finalOrder.receiverAddress.length > 0,
    receiverAddressDetail: finalOrder.receiverAddressDetail.length > 0,
    products:
      finalOrder.products.length > 0 &&
      finalOrder.products.every((p) => p.name.length > 0 && p.price > 0 && p.quantity > 0),
  };
  const isValid = Object.values(validity).every((v) => v);

  const createOrder = useCreateOrder(finalOrder, {
    onSuccess: () => navigate.back(),
  });
  const postCodePopup = usePostCodePopup({
    onComplete: (data) => {
      changeActions.setReceiverAddress(data.roadAddress);
    },
  });

  return (
    <main className='p-3 h-full flex-1 overflow-auto flex flex-col'>
      {/* Toolbar */}
      <div className='mb-3 flex flex-wrap gap-3'>
        {/* Back */}
        <button type='button' className='m-box px-3 py-2 m-hover' onClick={navigate.back}>
          <FaIcon icon={faArrowLeft} /> 뒤로가기
        </button>

        {/* Expander */}
        <span className='flex-1'></span>

        {/* Clear */}
        <button
          type='button'
          className='m-box px-3 py-2 m-hover disabled:opacity-40'
          disabled={order.data === change || createOrder.isLoading}
          onClick={() => changeActions.reset()}
        >
          <FaIcon icon={faNotdef} rotation={90} /> 초기화
        </button>

        {/* Save */}
        <button
          type='button'
          className='m-box px-3 py-2 m-hover disabled:opacity-40'
          disabled={!isValid || createOrder.isLoading}
          onClick={() => createOrder.mutate()}
        >
          {createOrder.isLoading ? (
            <>
              <FaIcon icon={faSpinner} className='animate-spin' /> 저장중...
            </>
          ) : (
            <>
              <FaIcon icon={faFloppyDisk} /> 저장
            </>
          )}
        </button>
      </div>

      {/* Form */}
      <form action='' onSubmit={(e) => e.preventDefault()} className='flex gap-2 flex-1'>
        <div>
          <fieldset className='fieldset'>
            <legend className='legend'>
              <FaIcon icon={faBoxesStacked} /> 상품목록
            </legend>

            <table className='grid gap-1' style={{ gridTemplateColumns: "auto 5rem" }}>
              <thead className='contents'>
                <tr className='contents'>
                  <th className='font-normal w-full'>
                    <FaIcon icon={faBox} /> 상품명
                  </th>
                  <th className='font-normal'>
                    <FaIcon icon={faCoins} /> 가격(원)
                  </th>
                </tr>
              </thead>
              <tbody className='contents'>
                {products?.data.map((product, index) => (
                  <tr className='contents'>
                    <td
                      className='text-center btn p-2 shadow-none w-52'
                      onClick={() =>
                        changeActions.addProduct({
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                        })
                      }
                      onDoubleClick={() => navigate.push("/admin/products/" + product.id)}
                    >
                      {product.name}
                    </td>
                    <td className='text-center btn p-2 shadow-none'>
                      {product.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
        </div>

        <div className='w-72'>
          <fieldset className='fieldset'>
            <legend className='legend' onClick={senderInfo.toggle}>
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
                type='text'
                placeholder='홍길동'
                disabled={createOrder.isLoading}
                value={change.senderName}
                onChange={changeActions.onSenderNameChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='sender-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <Input
                id='sender-phone'
                list='sender-phone-list'
                type='tel'
                placeholder='010-xxxx-xxxx'
                disabled={createOrder.isLoading}
                value={change.senderPhone}
                onChange={changeActions.onSenderPhoneChange}
                required
              />
              <datalist id='sender-phone-list'>
                {customers?.data?.data?.map((customer) => (
                  <option key={customer.id} value={customer.phone}></option>
                ))}
              </datalist>
            </div>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='legend'>
              <FaIcon icon={faPaperPlane} fontSize={16} /> 받는 사람
            </legend>

            <div className='field'>
              <label htmlFor='same-as-sender' className='label'>
                <FaIcon icon={faPaperPlane} /> 보내는 사람과
              </label>
              <CheckBox
                checked={change.sameAsSender}
                disable={createOrder.isLoading}
                toggleFn={changeActions.toggleSameAsSender}
                trueElements={[<FaIcon icon={faEquals} />, "같음"]}
                falseElements={[<FaIcon icon={faNotEqual} />, " 같지 않음"]}
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-name' className='label'>
                <FaIcon icon={faSignature} /> 이름
              </label>
              <Input
                id='receiver-name'
                type='text'
                placeholder='홍길동'
                disabled={change.sameAsSender || createOrder.isLoading}
                value={finalOrder.receiverName}
                onChange={changeActions.onReceiverNameChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-phone' className='label'>
                <FaIcon icon={faMobileScreenButton} /> 전화번호
              </label>
              <Input
                id='receiver-phone'
                type='text'
                placeholder='010-xxxx-xxxx'
                disabled={change.sameAsSender || createOrder.isLoading}
                value={finalOrder.receiverPhone}
                onChange={changeActions.onReceiverPhoneChange}
                required
              />
            </div>

            <div className='field'>
              <label htmlFor='receiver-address' className='label'>
                <FaIcon icon={faSignsPost} /> 주소
              </label>
              <Input
                id='receiver-address'
                type='text'
                placeholder='남원월산로74번길 42'
                disabled={createOrder.isLoading}
                value={change.receiverAddress}
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
                type='text'
                placeholder='단독주택, 1층 101호, ...'
                disabled={createOrder.isLoading}
                value={change.receiverAddressDetail}
                onChange={changeActions.onReceiverAddressDetailChange}
                required
              />
            </div>
          </fieldset>
        </div>

        <div>
          <fieldset className='fieldset'>
            <legend className='legend'>
              <FaIcon icon={faBoxesStacked} /> 배송물품
            </legend>

            <table className='grid gap-1' style={{ gridTemplateColumns: "repeat(4, auto)" }}>
              <thead className='contents'>
                <tr className='contents'>
                  <th className='font-normal'>
                    <FaIcon icon={faBox} /> 상품명
                  </th>
                  <th className='font-normal'>
                    <FaIcon icon={faCoins} /> 가격(원)
                  </th>
                  <th className='font-normal'>
                    <FaIcon icon={faCalculator} /> 수량(개)
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody className='contents'>
                {finalOrder.products.map((product, index, arr) => (
                  <tr className='contents'>
                    <td className='text-center'>
                      <Input
                        id='product-name'
                        list='product-name-list'
                        type='text'
                        className='text-center'
                        disabled={createOrder.isLoading}
                        value={product.name}
                        onChange={(e) =>
                          changeActions.setProductName({ index, name: e.target.value })
                        }
                        invalid={product.name.length <= 0}
                      />
                    </td>
                    <td className='relative'>
                      <Input
                        id='product-price'
                        type='text'
                        className='text-center w-28'
                        value={product.price.toLocaleString()}
                        onChange={(e) =>
                          changeActions.setProductPrice({
                            index,
                            price: Number(e.target.value.replaceAll(",", "")),
                          })
                        }
                      />
                    </td>
                    <td className='relative'>
                      <Input
                        id='product-quantity'
                        type='text'
                        className='text-center w-28'
                        disabled={createOrder.isLoading}
                        value={product.quantity.toLocaleString()}
                        onChange={(e) =>
                          changeActions.setQuantity({
                            index,
                            quantity: Number(e.target.value.replaceAll(",", "")) || 0,
                          })
                        }
                        required
                        invalid={product.quantity <= 0}
                      />
                    </td>
                    <td>
                      <button
                        type='button'
                        className='btn w-10 h-full shadow-none'
                        onClick={() => changeActions.removeProduct(index)}
                        disabled={createOrder.isLoading || arr.length === 1}
                      >
                        <FaIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type='button'
              className='btn mt-2 p-2 w-full shadow-none'
              onClick={() => changeActions.addProduct(undefined)}
            >
              <FaIcon icon={faPlus} /> 추가하기
            </button>
          </fieldset>
        </div>
      </form>
    </main>
  );
}
