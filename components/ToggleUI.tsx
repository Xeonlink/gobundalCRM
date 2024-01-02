import { cn } from "@/extra/utils";
import { ComponentProps, useEffect, useState } from "react";

interface Props extends ComponentProps<"div"> {
  target: string;
  offClassName?: string;
  onClassName?: string;
}

export function ToggleUI(props: Props) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const target = document.querySelector(props.target) as HTMLInputElement;
    if (!target) {
      throw new Error("ToggleUI target is not exist.");
    }

    const callback = (e: Event) => {
      const target = e.target as HTMLInputElement;
      setIsOn(target.checked);
    };

    target.addEventListener("change", callback);

    return () => target.removeEventListener("change", callback);
  }, [isOn]);

  return (
    <div {...props} className={cn(props.className, isOn ? props.onClassName : props.offClassName)}>
      {props.children}
    </div>
  );
}
