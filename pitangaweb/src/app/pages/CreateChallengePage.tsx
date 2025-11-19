import { useNavigate } from 'react-router-dom';
import { ArrowLeftFromLineIcon } from 'lucide-react';

import { saveChallenge } from '@/infra/data/challenges.rest';

import { Button } from '@/components/ui/button';
import { ChallengeForm, ChallengeFormData } from '@/app/components/ChallengeForm';

export const CreateChallengePage = () => {
  const navigate = useNavigate();

  const handleCreate = async (data: ChallengeFormData) => {
    const response = await saveChallenge(data);
    navigate(`/challenges/${response.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <nav className="flex items-center w-full mb-4 gap-3">
        <Button onClick={() => navigate('/')}>
          <ArrowLeftFromLineIcon/>
        </Button>
        <h1 className="text-xl font-bold">
          Criar desafio
        </h1>
      </nav>

      {/* FORM */}
      <ChallengeForm
        mode="create"
        onSubmit={handleCreate}
      />
    </div>
  );
};
