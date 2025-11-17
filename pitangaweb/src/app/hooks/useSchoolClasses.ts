import { useQuery } from "@tanstack/react-query";
import { listSchoolClasses } from "@/infra/data/school.rest";

export const useSchoolClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: listSchoolClasses,
    staleTime: 1000 * 30, // opcional (30s)
  });
}
