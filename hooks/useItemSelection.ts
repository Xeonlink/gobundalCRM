import { useState } from "react";

export function useItemSelection() {
  const [ids, setIds] = useState<string[]>([]);

  const onItemClick =
    <T extends HTMLElement>(id: string) =>
    (e: React.MouseEvent<T>) => {
      if (e.ctrlKey || e.metaKey) {
        if (ids.includes(id)) {
          setIds((prev) => prev.filter((selectedId) => selectedId !== id));
        } else {
          setIds((prev) => [...prev, id]);
        }
      } else {
        setIds([id]);
      }
    };

  const select = (id: string) => {
    setIds([id]);
  };

  const clear = () => {
    setIds([]);
  };

  const includes = (id: string) => ids.includes(id);

  return { select, onItemClick, ids, setIds, clear, includes, isEmpty: ids.length === 0 };
}
