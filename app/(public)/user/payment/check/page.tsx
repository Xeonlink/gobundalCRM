import { PageProps } from "@/extra/type";

type Props = PageProps<
  {},
  {
    paymentId: string;
  }
>;

export default async function Page(props: Props) {
  const paymentId = props.searchParams.paymentId;

  return <div></div>;
}
