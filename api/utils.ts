import axios from "axios";
import { getIdToken } from "./auth";
import { PrismaClient } from "@prisma/client";

export const apiRoot = (() => {
  const apiBase = axios.create({
    baseURL: "/api",
  });

  apiBase.interceptors.request.use(async (config) => {
    const token = await getIdToken();
    config.headers.Authorization = token;
    return config;
  });

  return apiBase;
})();

export type GetResponse<T> = {
  data: T[];
};
