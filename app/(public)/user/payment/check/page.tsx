import { PageProps } from "@/extra/type";

type Props = PageProps<
  {},
  {
    paymentId: string;
    txId: string;
  }
>;

export default async function Page(props: Props) {
  const { paymentId, txId } = props.searchParams;

  return <div></div>;
}
