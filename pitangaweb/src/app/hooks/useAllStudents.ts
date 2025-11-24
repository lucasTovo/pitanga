import { useQuery } from "@tanstack/react-query";

import { listUsers } from "@/infra/data/school.rest";

export function useAllStudents() {
  const query = useQuery({
    queryKey: ["all-students"],
    queryFn: listUsers,
  });

  return {
    allStudents: query.data ?? [],
    allStudentsIsLoading: query.isLoading,
    allStudentsIsError: query.isError,
    allStudentsRefetch: query.refetch,
  }
}
