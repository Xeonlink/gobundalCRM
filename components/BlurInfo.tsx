import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";

type BlurInfoProps = {
  open: boolean;
  closeFn: () => void;
};

export function BlurInfo(props: PropsWithChildren<BlurInfoProps>) {
  const { open, closeFn, children } = props;

  return (
    <div
      className='absolute top-0 left-0 w-full h-full z-10 backdrop-blur-sm rounded-md overflow-hidden flex flex-col items-center justify-center transition-all aria-hidden:hidden'
      aria-hidden={!open}
    >
      <span className='mb-4'>{children}</span>
      <button type='button' className='m-box px-3 py-2 m-hover' onClick={closeFn}>
        <FontAwesomeIcon icon={faXmark} width={15} height={15} className='mr-1 opacity-75' />
        <span>닫기</span>
      </button>
    </div>
  );
}
