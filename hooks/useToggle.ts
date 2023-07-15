import { useState } from "react";

export function useToggle(defaultValue: boolean) {
  const [isOn, setIsOn] = useState(defaultValue);

  const on = () => {
    setIsOn(true);
  };

  const off = () => {
    setIsOn(false);
  };

  const toggle = () => {
    setIsOn((prev) => !prev);
  };

  return { isOn, toggle, on, off };
}
