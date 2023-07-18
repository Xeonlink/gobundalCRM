export type EmptyObject<T = any> = {
  [key: string]: T;
};

export interface PageProps<P = EmptyObject, S = EmptyObject> {
  params: P;
  searchParams: S;
}
