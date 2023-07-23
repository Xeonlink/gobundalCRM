import { useEffect, useRef, useState } from "react";

export function useShortcut(
  shortcut: string,
  callback: (e: KeyboardEvent) => void,
  deps: any[] = []
) {
  useEffect(() => {
    const shortcutHandler = (e: KeyboardEvent) => {
      const keys = shortcut
        .toLowerCase()
        .split("+")
        .map((key) => key.trim());

      const keysSet = new Set(keys);
      if (keysSet.delete("ctrl") !== e.ctrlKey) return;
      if (keysSet.delete("alt") !== e.altKey) return;
      if (keysSet.delete("shift") !== e.shiftKey) return;
      if (keysSet.delete("meta") !== e.metaKey) return;
      const last = keysSet.values().next();
      if (last.done) return;
      if (last.value !== e.key) return;
      callback(e);
    };
    window.addEventListener("keydown", shortcutHandler);

    return () => {
      window.removeEventListener("keydown", shortcutHandler);
    };
  }, deps);
}
