import { DetailedHTMLProps, DialogHTMLAttributes, ForwardedRef, forwardRef } from "react";

export const Dialog = forwardRef(
  (
    props: DetailedHTMLProps<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>,
    ref: ForwardedRef<HTMLDialogElement>
  ) => {
    const { children, ...rest } = props;

    return (
      <dialog
        ref={ref}
        {...rest}
        className='max-w-full max-h-full rounded-md p-0 bg-transparent backdrop:backdrop-blur-md animate-scaleTo1 focus:outline-none'
      >
        {children}
      </dialog>
    );
  }
);
