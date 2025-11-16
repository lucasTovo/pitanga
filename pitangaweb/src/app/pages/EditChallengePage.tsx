import { useEffect, useState } from "react";
import { ChallengeForm, ChallengeFormData } from "../components/ChallengeForm";
import { useNavigate, useParams } from "react-router-dom";
import { getChallengeById, updateChallenge } from "@/infra/data/challenges.rest";
import { Spinner } from "@/components/ui/spinner";
import { Challenge } from "@/types/challenges.types";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLineIcon } from "lucide-react";

function adaptChallengeToForm(data: Challenge): ChallengeFormData {
  return {
    title: data.title,
    level: data.level,
    description: data.description,
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

  if (!id) {
    throw new Error("Missing challenge id in route parameters.");
  }

  useEffect(() => {
    async function load() {
      const challenge = await getChallengeById(id!);
      if(challenge) {
        setChallenge(adaptChallengeToForm(challenge));
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
    <div className="max-w-3xl mx-auto py-6">
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
      />
    </div>
  );
};
