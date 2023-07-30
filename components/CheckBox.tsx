"use client";

type CheckBoxProps = {
  checked: boolean;
  disable: boolean;
  toggleFn: () => void;
  trueElements: React.ReactNode[];
  falseElements: React.ReactNode[];
};

export function CheckBox(props: CheckBoxProps) {
  const { checked, toggleFn, trueElements, falseElements: falseElement } = props;

  return (
    <div className='flex gap-3 disabled:opacity-40 mb-3' aria-disabled={props.disable}>
      <button
        type='button'
        className='btn w-full shadow-none p-2'
        disabled={checked}
        onClick={toggleFn}
      >
        {trueElements}
      </button>
      <button
        type='button'
        className='btn w-full shadow-none p-2'
        disabled={!checked}
        onClick={toggleFn}
      >
        {falseElement}
      </button>
    </div>
  );
}
