import { ComponentProps, useEffect } from "react";

type Props = Omit<ComponentProps<"img">, "src"> & {
  blob: Blob;
};

export function BlobImg(props: Props) {
  const src = URL.createObjectURL(props.blob);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(src);
    };
  }, [src]);

  return <img {...props} src={src} />;
}
