import { useQuery } from '@tanstack/react-query';

import { getSchoolClassById } from '@/infra/data/school.rest';

export const useSchoolClass = (classId?: string) => {
  const query = useQuery({
    queryKey: ['class', classId],
    queryFn: () => getSchoolClassById(classId!),
    enabled: !!classId,
  });

  return {
    schoolClass: query.data ?? null,
    schoolClassIsLoading: query.isLoading,
    schoolClassIsError: query.isError,
    schoolClassRefetch: query.refetch,
  }
};
