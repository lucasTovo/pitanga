import { useNavigate } from 'react-router-dom';
import { ArrowLeftFromLineIcon, ClipboardListIcon } from 'lucide-react';

import { useUser } from '@/app/hooks/useUser';
import { useSchoolClass } from '@/app/hooks/useSchoolClass';
import { useClassChallenges } from '@/app/hooks/useClassChallenges';
import { useCompletedSummary } from '@/app/hooks/useCompletedSummary';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChallengeCard } from '@/app/components/ChallengeCard';

type StudentViewProps = {
  classId: string;
};

export const StudentView = ({ classId }: StudentViewProps) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const {
    schoolClass,
    schoolClassIsLoading,
    schoolClassIsError
  } = useSchoolClass(classId);

  const {
    classChallenges,
    classChallengesIsLoading,
    classChallengesIsError
  } = useClassChallenges(schoolClass?.challenges);

  const {
    completedSummary,
    completedSummaryIsLoading,
    completedSummaryIsError
  } = useCompletedSummary(schoolClass?.students, schoolClass?.challenges);

  if (schoolClassIsLoading || classChallengesIsLoading) return <p>Carregando...</p>;
  if (schoolClassIsError || classChallengesIsError) return <p>Erro</p>;

  if (!schoolClass) return <p>Erro</p>;

  return (
    <>
      <div className='flex gap-2'>
        <Button className='h-auto' onClick={() => navigate('/')}>
          <ArrowLeftFromLineIcon />
        </Button>

        <Card className="w-full flex flex-col">
          <CardHeader className='py-4 px-6'>
            <CardTitle>{schoolClass.name}</CardTitle>
            <CardDescription>{schoolClass.description}</CardDescription>
          </CardHeader>

          <Separator />

          <CardFooter className='py-3 px-6'>
            <div className='flex gap-2 items-start'>
              <Badge variant="outline" className='text-sm font-bold text-primary border-2 border-primary'>
                <ClipboardListIcon className='mr-1'/>
                {schoolClass.challenges.length}
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </div>

      <h3 className='py-2 px-4 text-center rounded-lg bg-card font-medium text-foreground text-sm'>
        Desafios da turma
      </h3>

      <ScrollArea className={cn(
        'flex flex-1',
        '[&_[data-radix-scroll-area-viewport]>div]:!block', {/* Evita display: table no SrollAreaViewport */}
      )}>
        <div className="pr-3 flex flex-wrap gap-4">
          {classChallenges.map((ch) => (
            <ChallengeCard
              key={ch.id}
              challenge={ch}
              onAction={(id) => navigate(`/challenges/${id}`)}
              done={completedSummary?.[user.id].completedChallenges.includes(ch.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
