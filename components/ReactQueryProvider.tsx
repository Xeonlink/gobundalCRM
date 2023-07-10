"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
};

export function ReactQueryProvider(props: Props) {
  const { children } = props;

  const { current: queryClient } = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          // refetchOnWindowFocus: false,
        },
      },
    })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
