import { GetResponse, apiRoot } from "./utils";

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

export async function getTeams(date: string) {
  const uri = `/teams`;
  const config = { params: { date } };
  const res = await apiRoot.get<GetResponse<Team>>(uri, config);
  return res.data;
}

export async function postTeam(team: RawTeam) {
  const uri = `/teams`;
  const body = team;
  const res = await apiRoot.post(uri, body);
  return res.data;
}

export async function getTeam(date: string, id: string) {
  const uri = `/teams/${id}`;
  const config = { params: { date } };
  const res = await apiRoot.get<Team>(uri, config);
  return res.data;
}

export async function patchTeam(date: string, id: string, partialRawTeam: Partial<RawTeam>) {
  const uri = `/teams/${id}`;
  const body = partialRawTeam;
  const config = { params: { date } };
  const res = await apiRoot.patch(uri, body, config);
  return res.data;
}

export async function deleteTeam(date: string, id: string) {
  const uri = `/teams/${id}`;
  const config = { params: { date } };
  const res = await apiRoot.delete(uri, config);
  return res.data;
}

export async function deleteTeams(date: string, ids: string[]) {
  const uri = `/teams`;
  const config = { params: { date, ids: JSON.stringify(ids) } };
  const res = await apiRoot.delete(uri, config);
  return res.data;
}
