// src/hooks/useChallenges.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { listChallenges } from '@/infra/data/challenges.rest';

export const useChallenges = () => {
  const query = useInfiniteQuery({
    queryKey: ['challenges'],
    queryFn: listChallenges,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.last ? lastPage.number + 1 : undefined,
  });

  const challengesFlattened = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.content) ?? [];
  }, [query.data]);

  return {
    challenges: challengesFlattened,
    challengesFetchNextPage: query.fetchNextPage,
    challengesHasNextPage: query.hasNextPage,
    challengesIsFetchingNextPage: query.isFetchingNextPage,
  }
};
