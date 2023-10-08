"use client";

export function ShowBusinessInfoBtn(
  props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
) {
  const showInfoDialog = () => {
    const businessInfo = document.querySelector("#business-info") as HTMLDialogElement;
    businessInfo?.showModal();
  };

  return (
    <button type="button" onClick={showInfoDialog} {...props}>
      {props.children}
    </button>
  );
}
