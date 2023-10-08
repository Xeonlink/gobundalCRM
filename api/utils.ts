import axios from "axios";
import { getIdToken } from "./auth";

export const apiRoot = (() => {
  const apiBase = axios.create({
    baseURL: "https://ntm02yf619.execute-api.ap-northeast-2.amazonaws.com/prod",
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
