import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addChallengeToSchoolClass } from "@/infra/data/school.rest";

export function useAddChallengeToSchoolClass(classId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ challengeId }: { challengeId: string }) => {
      if (!classId) throw new Error("Class ID missing");
      return addChallengeToSchoolClass(classId, challengeId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },

    onError: () => {
      console.error("Erro ao adicionar desafio à turma");
    }
  });

  return {
    addChallenge: mutation.mutate,
    addingChallenge : mutation.isPending
  }
}
