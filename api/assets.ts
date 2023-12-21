import axios from "axios";
import { apiRoot } from "./utils";

export async function uploadImage(file: File) {
  const config = { params: { mimeType: file.type } };
  const { data: signedUrl } = await apiRoot.get<string>("/assets/signedUrl", config);
  const { protocol, hostname, pathname } = new URL(signedUrl);
  const src = await axios.put(signedUrl, file).then(() => `${protocol}//${hostname}${pathname}`);
  return src;
}
