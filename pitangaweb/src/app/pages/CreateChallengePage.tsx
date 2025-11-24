import { useNavigate } from 'react-router-dom';
import { ArrowLeftFromLineIcon } from 'lucide-react';

import { saveChallenge } from '@/infra/data/challenges.rest';

import { Button } from '@/components/ui/button';
import { PageContainer } from '@/app/components/PageContainer';
import { ChallengeForm, ChallengeFormData } from '@/app/components/ChallengeForm';

export const CreateChallengePage = () => {
  const navigate = useNavigate();

  const handleCreate = async (data: ChallengeFormData) => {
    const response = await saveChallenge(data);
    navigate(`/challenges/${response.id}`);
  };

  return (
    <PageContainer className='max-w-4xl'>
      <nav className="flex items-center w-full mb-4 gap-4">
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
    </PageContainer>
  );
};
