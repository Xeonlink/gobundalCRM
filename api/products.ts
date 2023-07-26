import { GetResponse, apiRoot } from "./utils";

export interface Product {
  id: string;
  enabled: boolean;
  name: string;
  price: number;
  isSale: boolean;
  salePrice: number;
  remain: number;
}

export type RawProduct = Omit<Product, "id">;

export async function getProducts() {
  const uri = `/products`;
  const res = await apiRoot.get<GetResponse<Product>>(uri);
  return res.data;
}

export async function postProduct(product: RawProduct) {
  const uri = `/products`;
  const body = product;
  const res = await apiRoot.post(uri, body);
  return res.data;
}

export async function getProduct(id: string) {
  const uri = `/products/${id}`;
  const res = await apiRoot.get<Product>(uri);
  return res.data;
}

export async function patchProduct(id: string, product: Partial<Product>) {
  const uri = `/products/${id}`;
  const body = product;
  const res = await apiRoot.patch(uri, body);
  return res.data;
}

export async function deleteProduct(id: string) {
  const uri = `/products/${id}`;
  const res = await apiRoot.delete(uri);
  return res.data;
}

export async function deleteProducts(ids: string[]) {
  const uri = `/products`;
  const config = { params: { ids: JSON.stringify(ids) } };
  const res = await apiRoot.delete(uri, config);
  return res.data;
}
