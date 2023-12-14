import { LayoutProps } from "@/extra/type";
import { db } from "@/prisma/db";
import { ProductCategoryProvider } from "./ProductCategoryContext";

export default async function Layout(props: LayoutProps<{ categoryId: string }>) {
  const id = +props.params?.categoryId!;
  const productCategory = await db.productCategory.findFirst({ where: { id } });

  return (
    <ProductCategoryProvider value={productCategory}>{props.children}</ProductCategoryProvider>
  );
}
