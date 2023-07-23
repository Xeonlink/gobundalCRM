export type EmptyObject<T = any> = {
  [key: string]: T;
};

export interface PageProps<P = EmptyObject, S = EmptyObject> {
  params: P;
  searchParams: S;
}

export type ModalProps<T = {}> = T & {
  id?: string;
  closeSelf?: () => void;
  ref?: (instance: HTMLDialogElement) => void;
};
