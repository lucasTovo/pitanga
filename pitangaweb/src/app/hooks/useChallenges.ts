// src/hooks/useChallenges.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { listChallenges } from '@/infra/data/challenges.rest';

export const useChallenges = () => {
  return useInfiniteQuery({
    queryKey: ['challenges'],
    queryFn: listChallenges,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.last ? lastPage.number + 1 : undefined,
  });
};
