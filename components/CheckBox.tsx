import { FontAwesomeIcon as FaIcon, FaIconProps } from "@fortawesome/react-fontawesome";

type CheckBoxProps = {
  checked: boolean;
  "aria-diabled": boolean;
  toggleFn: () => void;
  trueIcon?: FaIconProps["icon"];
  falseIcon?: FaIconProps["icon"];
};

export function CheckBox(props: CheckBoxProps) {
  const { checked, toggleFn, trueIcon, falseIcon } = props;

  return (
    <div className='flex gap-3 disabled:opacity-40 mb-3' aria-disabled={props["aria-diabled"]}>
      <button
        type='button'
        className='rounded-md bg-white p-2 w-full disabled:opacity-40'
        disabled={checked}
        onClick={toggleFn}
      >
        {!!trueIcon ? (
          <FaIcon icon={trueIcon} width={20} height={20} className='mr-1 opacity-75' />
        ) : null}
        <span>동일함</span>
      </button>
      <button
        type='button'
        className='rounded-md bg-white p-2 w-full disabled:opacity-40'
        disabled={!checked}
        onClick={toggleFn}
      >
        {!!falseIcon ? (
          <FaIcon icon={falseIcon} width={20} height={20} className='mr-1 opacity-75' />
        ) : null}
        <span>동일하지 않음</span>
      </button>
    </div>
  );
}
