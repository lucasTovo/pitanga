import { Params, redirect } from 'react-router-dom';

import { Challenge } from '@/types/challenges.types';
import { Solution } from '@/types/solutions.types';
import { Page } from '@/types/common.types';

import { challengesApi } from './base';

export async function listChallenges() {
  type Short = Page<Challenge>;
  const challengesRaw = await challengesApi.get<Short>('/challenges');

  if(!challengesRaw.data?.content) {
    throw new Error('Could not load page');
  }

  const challenges = challengesRaw.data?.content
  return challenges;
}

export async function getChallengeById(id: string) {
  try {
    const response = await challengesApi.get<Challenge>(`/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching challenge ${id}:`, error);
    return null;
  }
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

type ChallengeSaveCommand = {
  title: string;
  description: string;
  baseCode: string;
  validations: { input: string; output: string; }[];
};

export async function saveChallenge(props: ChallengeSaveCommand) {
  const res = await challengesApi.post<Challenge>('/challenges', {
    ...props,
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
