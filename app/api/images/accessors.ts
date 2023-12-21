import { GetResponse } from "@/api/utils";
import { Image } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getImages() {
  const images = await axios.get<GetResponse<Image>>(`/api/images`);
  return images.data;
}
export function useImages() {
  return useQuery(["images"], () => getImages(), {
    suspense: true,
  });
}
