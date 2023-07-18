import { useRef, useState } from "react";

class StatefulSet<T> extends Set<T> {
  private _callback?: () => void;

  constructor(iterable?: Iterable<T> | null | undefined, callback?: () => void) {
    super(iterable);
    this._callback = callback;
  }

  override add(value: T): this {
    const result = super.add(value);
    this._callback?.();
    return result;
  }

  override clear(): this {
    super.clear();
    this._callback?.();
    return this;
  }

  override delete(value: T): boolean {
    const result = super.delete(value);
    this._callback?.();
    return result;
  }
}

export function useSet<T>(iterable?: Iterable<T> | null | undefined) {
  const [_, setCount] = useState(0);
  const countUp = () => setCount((prev) => prev + 1);

  const { current: value } = useRef(new StatefulSet<T>(iterable, countUp));

  return value;
}
