import { useEffect } from 'react';
import { ChallengeListItem } from '../../domain/problem';
import { ChallengeItem } from '../components/challenge/item';
import { useLoaderData } from 'react-router-dom';
import { FabCreateChallenge } from '../components/fab-create-challenge';
import { ListFallback } from '../components/fallback';
import { Labels } from '../assets/i18n';
import { useAuth } from '../../auth/hook/useAuth';

export const ChallengesList = () => {
  const challenges = useLoaderData() as ChallengeListItem[];
  const {logout} = useAuth(); 

  useEffect(() => {
    document.title = 'Pitanga';
  }, []);

  const handleLogout = () => {
    logout(); // chama o logout do Keycloak
  };

  return (
    <div className='px-2'>
      <ListFallback itens={challenges} fallbackText={Labels.challenge.list.fallback}>
        {challenge => <ChallengeItem key={challenge.id} challenge={challenge} />}
      </ListFallback>
      <button 
        onClick={handleLogout} 
        style={{
          padding: '8px 16px',
          backgroundColor: '#d9534f',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >Sair</button>
      <FabCreateChallenge />
    </div>
  );
};
