import { MutateOption, QueryOptions } from "@/extra/type";
import { useAutoInvalidateMutation } from "@/hooks/useAutoInvalidateMutation";
import { db } from "@/prisma/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { apiRoot } from "./utils";

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

export async function postTeam(rawTeam: RawTeam) {
  const uri = `/teams`;
  const body = rawTeam;
  const res = await axios.post("/api" + uri, body);
  return res.data;
}

export function useCreateTeam(rawTeam: RawTeam, options?: MutateOption) {
  const mutationFn = async () => postTeam(rawTeam);

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

export function useDeleteTeam2() {
  const queryClient = useQueryClient();

  const mutationFn = async (id: string) => {
    const uri = `/teams/${id}`;
    const res = await apiRoot.delete(uri);
    return res.data;
  };

  return useMutation(["teams"], mutationFn, {
    onSuccess: (data, id) => {
      queryClient.invalidateQueries(["teams"]);
    },
  });
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
