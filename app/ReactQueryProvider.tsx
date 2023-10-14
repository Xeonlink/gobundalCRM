"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useRef } from "react";

export function ReactQueryProvider(props: PropsWithChildren) {
  const { current: queryClient } = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          // refetchOnWindowFocus: false,
        },
      },
    }),
  );

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
