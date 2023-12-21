import { LayoutProps } from "@/extra/type";

export default function Layout(props: LayoutProps<{}, { modal: React.ReactNode }>) {
  return (
    <>
      {props.children}
      {props.modal}
    </>
  );
}
