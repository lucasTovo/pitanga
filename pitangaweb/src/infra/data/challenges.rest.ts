import { Params, redirect } from 'react-router-dom';

import { Challenge, ChallengeDTO } from '@/types/challenges.types';
import { Solution } from '@/types/solutions.types';
import { Page } from '@/types/common.types';

import { challengesApi } from './base';

export const listChallenges = async ({pageParam = 0}): Promise<Page<Challenge>> => {
  const { data } = await challengesApi.get<Page<Challenge>>(
    `/challenges?page=${pageParam}&size=25`
  );
  return data;
}

export async function getChallengeById(id: string) {
  const response = await challengesApi.get<Challenge>(`/challenges/${id}`);
  return response.data;
}

export async function getChallengeSolution({ params }: { params: Params }) {
  try {
    const url = `/challenges/${params.challengeId}`;
    const challengeRaw = await challengesApi.get<Challenge>(url);
    const solutionRaw = await challengesApi.get<Solution>(`${url}/solutions`);

    const result = {
      challenge: challengeRaw.data as Challenge,
      solution: solutionRaw.status === 200 ? (solutionRaw.data as Solution) : undefined
    };

    return result;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return redirect('/?error=Challenge not found');
    }

    throw err;
  }
}

export async function saveChallenge(body: ChallengeDTO) {
  const res = await challengesApi.post<Challenge>('/challenges', {
    ...body,
    creatorId: "2", // cuidado se o tipo for string
  });

  return res.data;
}

type SaveCommand = { code: string, language: string, challengeId: string};

export async function saveSolution(params: SaveCommand) {
  const url = `/challenges/${params.challengeId}/solutions`;
  const newSolution = await challengesApi.put(url, {
    language: params.language,
    code: params.code
  });

  if(newSolution.status !== 200) {
    // TODO
    return;
  }

  const solutionRaw = await challengesApi.get<Solution>(url);
  return solutionRaw.data;
}

export async function deleteChallenge(id: string) {
  try {
    const response = await challengesApi.delete<Challenge>(
      `/challenges/${id}`,
      { validateStatus: (status => status >= 200 && status < 400) }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting challenge ${id}:`, error);
    return null;
  }
}

export async function updateChallenge(id: string, data: Partial<ChallengeDTO>) {
  const response = await challengesApi.patch(`/challenges/${id}`, data);
  return response.data;
}

interface CompletedChallengesCountDTO {
  studentIds: string[];
  challengeIds: string[];
}

interface CompletedChallengesCount {
  count: number;
  completedChallenges: string[];
}

export async function getCompletedChallengesCount(
  {studentIds, challengeIds}: CompletedChallengesCountDTO
): Promise<Record<string, CompletedChallengesCount>> {
  const response = await challengesApi.post('/solutions/completion-summary', {studentIds, challengeIds});
  return response.data;
}
