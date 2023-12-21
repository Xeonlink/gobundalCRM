import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getImage(id: string) {
  const image = await axios.get(`/api/images/${id}`);
  return image.data;
}
export function useImage(id: string) {
  return useQuery(["images", id], () => getImage(id), {
    suspense: true,
  });
}
