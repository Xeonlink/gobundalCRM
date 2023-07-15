import axios from "axios";

const axiosTeams = axios.create({
  baseURL: "https://u3n88nffni.execute-api.ap-northeast-2.amazonaws.com/prod",
});

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

type TeamsGetResponse = {
  data: Team[];
};

export async function getTeams(date: string) {
  const res = await axiosTeams.get<TeamsGetResponse>("/teams", {
    params: {
      date,
    },
  });

  return res.data;
}

export type RawTeam = Omit<Team, "date" | "id" | "isApproved" | "isLeave">;

export async function postTeam(team: RawTeam) {
  const res = await axiosTeams.post("/teams", team);
  return res.data;
}

export async function getTeam(date: string, id: string) {
  const res = await axiosTeams.get<Team>(`/teams/${id}`, {
    params: {
      date,
    },
  });

  return res.data;
}

export async function updateTeam(team: Team) {
  const date = team.date;
  const id = team.id;
  const subTeam: Omit<Team, "date" | "id"> = {
    leaderName: team.leaderName,
    leaderPhone: team.leaderPhone,
    coupon: team.coupon,
    isApproved: team.isApproved,
    isLeave: team.isLeave,
    population: team.population,
  };

  const res = await axiosTeams.patch(`/teams/${id}`, subTeam, {
    params: {
      date,
    },
  });

  return res.data;
}

export async function deleteTeam(date: string, id: string) {
  const res = await axiosTeams.delete(`/teams/${id}`, {
    params: {
      date,
    },
  });

  return res.data;
}
