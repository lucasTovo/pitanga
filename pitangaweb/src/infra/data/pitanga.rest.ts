import { Challenge } from '../../domain/problem';
import { plainToInstance } from 'class-transformer';
import { apiBase } from './base';
import { Params, redirect } from 'react-router-dom';
import { Solution } from '../../domain/problem/solution';
import { Page } from './page.dto';
import { ChallengeListItem } from '../../domain/problem/challenge';

export async function listChallenges() {
  type Short = Page<ChallengeListItem>;
  const challengesRaw = await apiBase.get<Short>('/challenges');
  if(!challengesRaw.data?.content) {
    throw new Error('Could not load page');
  }
  const challenges = challengesRaw.data?.content
    .map(c => plainToInstance(ChallengeListItem, c));

  return challenges;
}

export async function getChallengeSolution({ params }: {params: Params}) {
  const url = `/challenges/${params.challengeId}`;
  const challengeRaw = await apiBase.get<Challenge>(url);
  if(challengeRaw.status === 404) {
    return redirect('/?error=Challenge not found');
  }
  const solutionRaw = await apiBase.get<Solution>(url + '/solutions');
  const result = {
    challenge: plainToInstance(Challenge, challengeRaw.data),
    solution: undefined
  } as { challenge: Challenge, solution?: Solution };
  if(solutionRaw.status === 200) {
    result.solution = plainToInstance(Solution, solutionRaw.data);
  }
  return result;
}

type ChallengeSaveCommand = {
  title: string;
  description: string;
  baseCode: string;
  validations: { input: string; output: string; }[];
};

export async function saveChallenge(props: ChallengeSaveCommand) {
  const res = await apiBase.post<Challenge>('/challenges', {...props, creatorId: 2});
  console.log(res.data);
  return plainToInstance(Challenge, res.data);
}

type SaveCommand = { code: string, language: string, challengeId: string};

export async function saveSolution(params: SaveCommand) {
  const url = `/challenges/${params.challengeId}/solutions`;
  const newSolution = await apiBase.put(url, {
    language: params.language,
    code: params.code
  });
  if(newSolution.status !== 200) {
    // TODO
    return;
  }
  const solutionRaw = await apiBase.get<Solution>(url);
  return plainToInstance(Solution, solutionRaw.data);
}
