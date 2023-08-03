"use client";

import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CheckBoxProps = {
  checked: boolean;
  disable: boolean;
  toggleFn: () => void;
  trueContents: [IconDefinition | undefined | null, string];
  falseContents: [IconDefinition | undefined | null, string];
};

export function CheckBox(props: CheckBoxProps) {
  const { checked, toggleFn, trueContents, falseContents } = props;

  return (
    <div className="mb-3 flex gap-3 disabled:opacity-40" aria-disabled={props.disable}>
      <button
        type="button"
        className="btn w-full p-2 shadow-none"
        disabled={checked}
        onClick={toggleFn}
      >
        {!!trueContents[0] && <FontAwesomeIcon icon={trueContents[0]} />} {trueContents[1]}
      </button>
      <button
        type="button"
        className="btn w-full p-2 shadow-none"
        disabled={!checked}
        onClick={toggleFn}
      >
        {!!falseContents[0] && <FontAwesomeIcon icon={falseContents[0]} />} {falseContents[1]}
      </button>
    </div>
  );
}
