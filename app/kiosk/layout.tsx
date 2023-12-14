import { LayoutProps } from "@/extra/type";

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <body className="min-h-screen bg-gradient-to-b from-orange-200 to-green-200">{children}</body>
  );
}
