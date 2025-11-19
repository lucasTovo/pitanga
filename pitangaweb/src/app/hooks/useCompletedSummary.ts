import { useQuery } from "@tanstack/react-query";

import { getCompletedChallengesCount } from "@/infra/data/challenges.rest";

export function useCompletedSummary(
  studentIds?: string[],
  challengeIds?: string[]
) {
  const hasIds =
    !!studentIds &&
    !!challengeIds &&
    studentIds.length > 0 &&
    challengeIds.length > 0;

  const query = useQuery({
    queryKey: ["completed-summary", studentIds, challengeIds],
    queryFn: () => getCompletedChallengesCount({
      studentIds: studentIds!, challengeIds: challengeIds!
    }),
    enabled: hasIds,
  });

  return {
    completedSummary: query.data ?? null,
    completedSummaryIsLoading: query.isLoading,
    completedSummaryIsError: query.isError,
    completedSummaryRefetch: query.refetch,
  }
}
