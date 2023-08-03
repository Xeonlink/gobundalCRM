import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";

type BlurInfoProps = {
  open: boolean;
  closeFn: () => void;
};

export function BlurInfo(props: PropsWithChildren<BlurInfoProps>) {
  const { open, closeFn, children } = props;

  return (
    <div
      className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md backdrop-blur-sm transition-all aria-hidden:hidden"
      aria-hidden={!open}
    >
      <span className="mb-4">{children}</span>
      <button type="button" className="btn" onClick={closeFn}>
        <FaIcon icon={faXmark} /> 닫기
      </button>
    </div>
  );
}
