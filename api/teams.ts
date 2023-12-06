import { MutateOption, QueryOptions } from "@/extra/type";
import { useAutoInvalidateMutation } from "@/hooks/useAutoInvalidateMutation";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { GetResponse, apiRoot } from "./utils";

export const defaultTeam: RawTeam = {
  date: dayjs().format("YYYY-MM-DD"),
  leaderName: "",
  leaderPhone: "",
  coupon: "none",
  population: 1,
  isApproved: false,
  isLeave: false,
};

export interface Team {
  id: string;
  date: string;
  leaderName: string;
  leaderPhone: string;
  coupon: string;
  population: number;
  isApproved: boolean;
  isLeave: boolean;
}

export type RawTeam = Omit<Team, "id">;

/**
 * 특정 날짜에 입장한 팀에 대한 정보를 서버에서 가져오는 함수
 * @author 오지민
 * @param date YYYY-MM-DD 가져올 팀이 입장한 날짜
 * @returns 해당날짜에 입장한 팀들의 정보
 */
export async function getTeams(date: string) {
  const uri = `/teams`;
  const config = { params: { date } };
  const response = await apiRoot.get<GetResponse<Team>>(uri, config);
  return response.data;
}

/**
 * 특정 날짜에 입장한 팀에 대한 벙볼르 서버에서 가져오는 react-query hook
 * @author 오지민
 * @param date YYYY-MM-DD 가져올 팀이 입장한 날짜
 * @param options 쿼리옵션을 담은 객체
 * @returns 해당날짜에 입장한 팀들의 정보
 */
export function useTeams(date: string, options?: QueryOptions<GetResponse<Team>>) {
  const queryFn = async () => getTeams(date);

  return useQuery(["teams", date], queryFn, {
    // suspense: true,
    ...options,
  });
}

export function useCreateTeam(rawTeam: RawTeam, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/teams`;
    const body = rawTeam;
    const res = await apiRoot.post(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["teams"], mutationFn, options);
}

export function useUpdateTeam(
  id: string,
  partialRawTeam: Partial<Omit<Team, "id">>,
  options?: MutateOption,
) {
  const mutationFn = async () => {
    const uri = `/teams/${id}`;
    const body = partialRawTeam;
    const res = await apiRoot.patch(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["teams"], mutationFn, options);
}

export function useDeleteTeam(id: string, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/teams/${id}`;
    const res = await apiRoot.delete(uri);
    return res.data;
  };

  return useAutoInvalidateMutation(["teams"], mutationFn, options);
}

export function useTeam(id: string, options?: QueryOptions<Team>) {
  const queryFn = async () => {
    const uri = `/teams/${id}`;
    const res = await apiRoot.get<Team>(uri);
    return res.data;
  };

  return useQuery(["teams", id], queryFn, {
    suspense: true,
    ...options,
  });
}

export function useDeleteTeams(ids: string[], options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/teams`;
    const config = { params: { ids: JSON.stringify(ids) } };
    const res = await apiRoot.delete(uri, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["teams"], mutationFn, options);
}
