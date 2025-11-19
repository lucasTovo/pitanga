import { useQuery } from "@tanstack/react-query";

import { getUser } from "@/infra/data/school.rest";

export function useClassStudents(studentIds?: string[]) {
  const hasIds = !!studentIds && studentIds.length > 0;

  const query = useQuery({
    queryKey: ['class-students', studentIds],
    queryFn: async () => {
      const results = await Promise.all(studentIds!.map(id => getUser(id)));
      return results.filter(Boolean);
    },
    enabled: hasIds,
  });

  return {
    classStudents: query.data ?? [],
    classStudentsIsLoading: query.isLoading,
    classStudentsIsError: query.isError,
    classStudentsRefetch: query.refetch,
  }
}
