import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

type CheckBoxProps = {
  checked: boolean;
  "aria-diabled": boolean;
  toggleFn: () => void;
  trueIcon?: FontAwesomeIconProps["icon"];
  falseIcon?: FontAwesomeIconProps["icon"];
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
          <FontAwesomeIcon icon={trueIcon} width={20} height={20} className='mr-1 opacity-75' />
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
          <FontAwesomeIcon icon={falseIcon} width={20} height={20} className='mr-1 opacity-75' />
        ) : null}
        <span>동일하지 않음</span>
      </button>
    </div>
  );
}
