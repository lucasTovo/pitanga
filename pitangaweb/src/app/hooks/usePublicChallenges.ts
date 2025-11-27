// src/hooks/useChallenges.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { listPublicChallenges } from '@/infra/data/challenges.rest';

export const usePublicChallenges = () => {
  const query = useInfiniteQuery({
    queryKey: ['public-challenges'],
    queryFn: listPublicChallenges,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.last ? lastPage.number + 1 : undefined,
  });

  const challengesFlattened = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.content) ?? [];
  }, [query.data]);

  return {
    publicChallenges: challengesFlattened,
    publicChallengesFetchNextPage: query.fetchNextPage,
    publicChallengesHasNextPage: query.hasNextPage,
    publicChallengesIsFetchingNextPage: query.isFetchingNextPage,
  }
};
