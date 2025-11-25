import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftFromLineIcon } from "lucide-react";

import { Challenge } from "@/types/challenges.types";

import { getChallengeById, updateChallenge } from "@/infra/data/challenges.rest";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PageContainer } from "@/app/components/PageContainer";
import { ChallengeForm, ChallengeFormData } from "@/app/components/ChallengeForm";

function adaptChallengeToForm(data: Challenge): ChallengeFormData {
  return {
    title: data.title,
    level: data.level,
    description: data.description,
    isPublic: data.isPublic,
    baseCode: data.baseCode,
    validations: data.validations.map(v => ({
      input: v.testInput,
      output: v.expectedOutput
    }))
  };
}

export const EditChallengePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<ChallengeFormData | null>(null);
  const [isCopy, setIsCopy] = useState(false);

  if (!id) {
    throw new Error("Missing challenge id in route parameters.");
  }

  useEffect(() => {
    async function load() {
      const challenge = await getChallengeById(id!);
      if(challenge) {
        setChallenge(adaptChallengeToForm(challenge));
        setIsCopy(!!challenge.originChallengeId)
      }
    }

    if (id) {
      load();
    }
  }, [id]);

  const handleUpdate = async (data: ChallengeFormData) => {
    await updateChallenge(id, data);
    navigate(`/challenges/${id}`);
  };

  if (!challenge) return (
    <Spinner className='m-auto' />
  );

  return (
    <PageContainer className="max-w-4xl">
      <nav className="flex items-center w-full mb-4 gap-3">
        <Button onClick={() => navigate('/')}>
          <ArrowLeftFromLineIcon/>
        </Button>
        <h1 className="text-xl font-bold">
          Editar desafio
        </h1>
      </nav>

      <ChallengeForm
        mode="edit"
        initialValues={challenge}
        onSubmit={handleUpdate}
        isCopy={isCopy}
      />
    </PageContainer>
  );
};
