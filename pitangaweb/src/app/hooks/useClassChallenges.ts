import { useQuery } from "@tanstack/react-query";

import { getChallengeById } from "@/infra/data/challenges.rest";

export function useClassChallenges(challengeIds?: string[]) {
  const hasIds = !!challengeIds && challengeIds.length > 0;

  const query = useQuery({
    queryKey: ["class-challenges", challengeIds],
    queryFn: async () => {
      const results = await Promise.all(challengeIds!.map(id => getChallengeById(id)));
      return results.filter(Boolean);
    },
    enabled: hasIds,
  });

  return {
    classChallenges: query.data ?? [],
    classChallengesIsLoading: query.isLoading,
    classChallengesIsError: query.isError,
    classChallengesRefetch: query.refetch,
  }
}
