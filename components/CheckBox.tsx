"use client";

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

type CheckBoxProps = {
  checked: boolean;
  "aria-diabled": boolean;
  toggleFn: () => void;
  trueIcon?: IconDefinition;
  falseIcon?: IconDefinition;
  trueText: string;
  falseText: string;
};

export function CheckBox(props: CheckBoxProps) {
  const { checked, toggleFn, trueIcon, falseIcon, trueText, falseText } = props;

  return (
    <div className='flex gap-3 disabled:opacity-40 mb-3' aria-disabled={props["aria-diabled"]}>
      <button
        type='button'
        className='btn w-full shadow-none p-2'
        disabled={checked}
        onClick={toggleFn}
      >
        {!!trueIcon ? <FaIcon icon={trueIcon} /> : null}
        {trueText}
      </button>
      <button
        type='button'
        className='btn w-full shadow-none p-2'
        disabled={!checked}
        onClick={toggleFn}
      >
        {!!falseIcon ? <FaIcon icon={falseIcon} /> : null}
        {falseText}
      </button>
    </div>
  );
}
