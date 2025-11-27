import { useQuery } from '@tanstack/react-query';

import { getChallengeSolution } from '@/infra/data/challenges.rest';

export const useChallengeSolution = (challengeId?: string) => {

  const query = useQuery({
    queryKey: ['challenge-solution', challengeId],
    queryFn: async () => await getChallengeSolution(challengeId!),
    enabled: !!challengeId,
  });

  return {
    challenge: query.data?.challenge ?? null,
    solution: query.data?.solution ?? null,
    challengeSolutionIsLoading: query.isLoading,
    challengeSolutionIsError: query.isError,
    challengeSolutionIsFetching: query.isFetching,
    challengeSolutionIsFetchedAfterMount: query.isFetchedAfterMount,
    challengeSolutionRefetch: query.refetch,
  }
};
