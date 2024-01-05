import { GetResponse } from "@/app/api/utils";
import { Team } from "@prisma/client";
import { withHost } from "../utils";

export async function getTeams(date: string) {
  const res = await fetch(withHost(`/api/teams?date=${date}`));
  const body = (await res.json()) as GetResponse<Team>;
  return body.data;
}

export async function postTeam(team: Team) {
  const res = await fetch(withHost("/api/teams"), {
    method: "POST",
    body: JSON.stringify(team),
  });
  const body = (await res.json()) as { data: string };
  if (body.data !== "OK") throw new Error(JSON.stringify(body));
  return body;
}

export async function getTeam(teamId: string) {
  const res = await fetch(withHost(`/api/teams/${teamId}`));
  const body = (await res.json()) as Team;
  return body;
}

export async function deleteTeam(teamId: string) {
  const res = await fetch(withHost(`/api/teams/${teamId}`), {
    method: "DELETE",
  });
  const body = (await res.json()) as { data: string };
  if (body.data !== "OK") throw new Error(JSON.stringify(body));
  return body;
}

export async function updateTeam(teamId: string, team: Partial<Team>) {
  const res = await fetch(withHost(`/api/teams/${teamId}`), {
    method: "UPDATE",
    body: JSON.stringify(team),
  });
  const body = (await res.json()) as { data: string };
  if (body.data !== "OK") throw new Error(JSON.stringify(body));
  return body;
}
