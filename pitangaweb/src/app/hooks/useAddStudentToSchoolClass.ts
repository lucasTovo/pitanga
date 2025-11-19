import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addStudentToSchoolClass } from "@/infra/data/school.rest";

export function useAddStudentToSchoolClass(classId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ studentId }: { studentId: string }) => {
      if (!classId) throw new Error("Class ID missing");
      return addStudentToSchoolClass(classId, studentId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },

    onError: () => {
      console.error("Erro ao adicionar aluno à turma");
    }
  });

  return {
    addStudent: mutation.mutate,
    addingStudent: mutation.isPending
  }
}
