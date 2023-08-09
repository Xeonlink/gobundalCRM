import { throttle } from "@/extra/utils";
import { useEffect, useState } from "react";

export function useWindowSize(threshold: { [key: string]: [number, number] }) {
  const [threasholdKey, setThreasholdKey] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const innerWidth = window.innerWidth;
      Object.entries(threshold).map(([key, [start, end]]: [string, [number, number]]) => {
        if (innerWidth >= start && innerWidth < end && threasholdKey !== key) {
          setThreasholdKey(key);
        }
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return threasholdKey;
}

export function useSimpleWindowSize(threshold: number[]) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const innerWidth = window.innerWidth;
      for (let index = 0; index < threshold.length; index++) {
        const element = threshold[index];
        if (!!threshold[index + 1] && innerWidth >= element && innerWidth < threshold[index + 1]) {
          setCount(index + 1);
          return;
        }
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return count;
}
