import { useQuery } from "@tanstack/react-query";

import { listSchoolClasses } from "@/infra/data/school.rest";

export const useSchoolClassList = () => {
  const query = useQuery({
    queryKey: ['classes'],
    queryFn: listSchoolClasses,
    staleTime: 1000 * 30, // opcional (30s)
  });

  return {
    schoolClassList: query.data,
    schoolClassListIsLoading: query.isLoading,
    schoolClassListError: query.isError,
    schoolClassListRefetch: query.refetch,
  }
}
