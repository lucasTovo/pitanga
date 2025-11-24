import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftFromLineIcon, ClipboardListIcon, PlusIcon, UserIcon } from 'lucide-react';

import { useChallenges } from '@/app/hooks/useChallenges';
import { useAllStudents } from '@/app/hooks/useAllStudents';
import { useSchoolClass } from '@/app/hooks/useSchoolClass';
import { useClassStudents } from '@/app/hooks/useClassStudents';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import { useClassChallenges } from '@/app/hooks/useClassChallenges';
import { useCompletedSummary } from '@/app/hooks/useCompletedSummary';
import { useAddStudentToSchoolClass } from '@/app/hooks/useAddStudentToSchoolClass';
import { useAddChallengeToSchoolClass } from '@/app/hooks/useAddChallengeToSchoolClass';

import { challengesColumns, challengesSubTableColumns } from '@/app/pages/SchoolClassPage/challengesColumns';
import { studentsColumns, studentsSubTableColumns } from '@/app/pages/SchoolClassPage/studentsColumns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataTable } from '@/app/components/DataTable';
import { ChallengeCard } from '@/app/components/ChallengeCard';

type Tab = 'students' | 'challenges';

type TeacherViewProps = {
  classId: string;
};

export const TeacherView = ({ classId }: TeacherViewProps) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('students');
  const [modalOpen, setModalOpen] = useState(false);

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
    classStudents,
    classStudentsIsLoading,
    classStudentsIsError
  } = useClassStudents(schoolClass?.students);

  const {
    allStudents,
    allStudentsIsLoading,
    allStudentsIsError
  } = useAllStudents();

  const {
    completedSummary,
    completedSummaryIsLoading,
    completedSummaryIsError
  } = useCompletedSummary(schoolClass?.students, schoolClass?.challenges);

  const {
    challenges: myChallenges,
    challengesFetchNextPage,
    challengesHasNextPage,
    challengesIsFetchingNextPage
  } = useChallenges();

  const { addStudent, addingStudent } = useAddStudentToSchoolClass(schoolClass?.id);
  const { addChallenge, addingChallenge } = useAddChallengeToSchoolClass(schoolClass?.id);

  const { lastElementRef } = useInfiniteScroll({
    hasNextPage: challengesHasNextPage,
    isFetching: challengesIsFetchingNextPage,
    onLoadMore: challengesFetchNextPage
  });

  const filterAvailableUsers = () => {
    const assignedIds = new Set(classStudents.map(student => student.id));
    return allStudents.filter(student => !assignedIds.has(student.id));
  };

  const getStudentsSolvedCount = (challengeId: string) => {
    if (!completedSummary) return 0;

    return Object.values(completedSummary).reduce((count, student) => {
      if (student.completedChallenges?.includes(challengeId)) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const dialogContent: Record<Tab, { button: string; title: string; description: string; loadingMsg: string }> = {
    students: {
      button: 'Adicionar aluno à turma',
      title: 'Lista de alunos',
      description: 'Escolha um aluno para adicionar',
      loadingMsg: 'Carregando alunos...',
    },
    challenges: {
      button: 'Adicionar desafio à turma',
      title: 'Lista de desafios',
      description: 'Escolha um desafio para adicionar',
      loadingMsg: 'Carregando desafios...',
    }
  };

  if (
    schoolClassIsLoading ||
    classChallengesIsLoading ||
    classStudentsIsLoading ||
    allStudentsIsLoading ||
    completedSummaryIsLoading
  ) return <p>Carregando...</p>;

  if (
    schoolClassIsError ||
    classChallengesIsError ||
    classStudentsIsError ||
    allStudentsIsError ||
    completedSummaryIsError
  ) return <p>Erro ao carregar dados</p>;

  if (!schoolClass) return <p>Erro</p>;

  return (
    <>
      {/* Header */}
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
                <UserIcon className='mr-1'/>
                {schoolClass.students.length}
              </Badge>

              <Badge variant="outline" className='text-sm font-bold text-primary border-2 border-primary'>
                <ClipboardListIcon className='mr-1'/>
                {schoolClass.challenges.length}
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue={tab}
        onValueChange={(value) => setTab(value as Tab)}
        className="flex flex-col flex-1 space-y-4 overflow-hidden"
      >
        <TabsList className='gap-6'>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
        </TabsList>

        {/* Aba Alunos */}
        <TabsContent value="students" className='data-[state=active]:flex flex-col flex-1 overflow-hidden'>
          <DataTable
            data={classStudents}
            columns={studentsColumns(completedSummary, classChallenges.length)}
            childColumns={(user) => studentsSubTableColumns(user, completedSummary)}
            children={classChallenges}
            searchPlaceholder="Buscar aluno..."
          />
        </TabsContent>

        {/* Aba Desafios */}
        <TabsContent value="challenges" className='data-[state=active]:flex flex-col flex-1 overflow-hidden'>
          <DataTable
            data={classChallenges}
            columns={challengesColumns(getStudentsSolvedCount, schoolClass.students.length)}
            childColumns={(challenge) => challengesSubTableColumns(challenge, completedSummary)}
            children={classStudents}
            searchPlaceholder="Buscar desafio..."
          />
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild className='block w-full max-w-sm mx-auto'>
          <Button className='flex'>
            <PlusIcon />
            {dialogContent[tab].button}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2x2 w-full max-h-[70vh] flex flex-col flex-1 overflow-hidden">
          <DialogHeader>
            <DialogTitle>{dialogContent[tab].title}</DialogTitle>
            <DialogDescription>{dialogContent[tab].description}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex flex-col flex-1">
            <div className="pr-3 flex flex-col gap-4">
              {tab === 'challenges' && (
                <>
                  {myChallenges.map((ch, index) => {
                    const isLast = index === myChallenges.length - 1;

                    return (
                      <ChallengeCard
                        key={ch.id}
                        ref={isLast ? lastElementRef : undefined}
                        actionLabel='Adicionar desafio'
                        challenge={ch}
                        fullWidth
                        onAction={() => {
                          addChallenge({ challengeId: ch.id });
                          setModalOpen(false);
                        }}
                      />
                    );
                  })}

                  {challengesIsFetchingNextPage && (
                    <Spinner className='m-auto' />
                  )}
                </>
              )}

              {tab === 'students' && (
                filterAvailableUsers().map(student => (
                  <Card key={student.id} className='p-6 flex items-center justify-between'>
                    <CardHeader className='p-1 space-y-0 flex flex-col gap-2'>
                      <CardTitle>{student.name}</CardTitle>
                      <CardDescription>{student.email}</CardDescription>
                    </CardHeader>

                    <CardFooter className='p-0'>
                      <Button
                        size='sm'
                        disabled={addingStudent}
                        onClick={() => {
                          addStudent({ studentId: student.id });
                          setModalOpen(false);
                        }}
                      >
                        Adicionar aluno
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
