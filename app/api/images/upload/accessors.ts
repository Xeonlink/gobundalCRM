import axios from "axios";

export async function uploadImage(file: File) {
  const config = {
    params: {
      filename: file.name,
      mimeType: file.type,
    },
  };
  const { data: signedUrl } = await axios.get<string>("/api/images/upload", config);
  const { protocol, hostname, pathname } = new URL(signedUrl);
  const src = await axios.put(signedUrl, file).then(() => `${protocol}//${hostname}${pathname}`);
  return src;
}
