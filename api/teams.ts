import { useAutoInvalidateMutation } from "@/api/utils/useAutoInvalidateMutation";
import { MutateOption, QueryOptions } from "@/extra/type";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetResponse, apiRoot } from "./utils/utils";

export interface Team {
  date: string;
  id: string;
  leaderName: string;
  leaderPhone: string;
  coupon: string;
  population: number;
  isApproved: boolean;
  isLeave: boolean;
}

export type RawTeam = Omit<Team, "date" | "id">;

export function useTeams(date: string, options?: QueryOptions<GetResponse<Team>>) {
  const auth = useAuth();

  const queryFn = async () => {
    const uri = `/teams`;
    const config = { params: { date } };
    const res = await apiRoot.get<GetResponse<Team>>(uri, config);
    return res.data;
  };

  return useQuery(["teams", date], queryFn, {
    suspense: true,
    enabled: auth.isSignIn,
    ...options,
  });
}

export function useCreateTeam(rawTeam: Partial<RawTeam>, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/teams`;
    const body = rawTeam;
    const res = await apiRoot.post(uri, body);
    return res.data;
  };

  return useAutoInvalidateMutation(["teams"], mutationFn, options);
}

export function useUpdateTeam(
  date: string,
  id: string,
  partialRawTeam: Partial<RawTeam>,
  options?: MutateOption
) {
  const mutationFn = async () => {
    const uri = `/teams/${id}`;
    const body = partialRawTeam;
    const config = { params: { date } };
    const res = await apiRoot.patch(uri, body, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["teams"], mutationFn, options);
}

export function useDeleteTeam(date: string, id: string, options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/teams/${id}`;
    const config = { params: { date } };
    const res = await apiRoot.delete(uri, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["teams"], mutationFn, options);
}

export function useTeam(date: string, id: string, options?: QueryOptions<Team>) {
  const auth = useAuth();

  const queryFn = async () => {
    const uri = `/teams/${id}`;
    const config = { params: { date } };
    const res = await apiRoot.get<Team>(uri, config);
    return res.data;
  };

  return useQuery(["team", date, id], queryFn, {
    suspense: true,
    enabled: auth.isSignIn,
    ...options,
  });
}

export function useDeleteTeams(date: string, ids: string[], options?: MutateOption) {
  const mutationFn = async () => {
    const uri = `/teams`;
    const config = { params: { date, ids: JSON.stringify(ids) } };
    const res = await apiRoot.delete(uri, config);
    return res.data;
  };

  return useAutoInvalidateMutation(["teams"], mutationFn, options);
}
