import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftFromLineIcon, ClipboardListIcon, PlusIcon, UserIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { useChallenges } from '@/app/hooks/useChallenges';
import { useAllStudents } from '@/app/hooks/useAllStudents';
import { useSchoolClass } from '@/app/hooks/useSchoolClass';
import { useClassStudents } from '@/app/hooks/useClassStudents';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import { useClassChallenges } from '@/app/hooks/useClassChallenges';
import { useCompletedSummary } from '@/app/hooks/useCompletedSummary';
import { useAddStudentToSchoolClass } from '@/app/hooks/useAddStudentToSchoolClass';
import { useAddChallengeToSchoolClass } from '@/app/hooks/useAddChallengeToSchoolClass';

import { Challenge } from '@/types/challenges.types';

import { cn } from '@/lib/utils';
import { copyChallenge } from '@/infra/data/challenges.rest';

import { useUser } from '@/app/hooks/useUser';
import { useActionDialog } from '@/app/hooks/useActionDialog';
import { usePublicChallenges } from '@/app/hooks/usePublicChallenges';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { studentsColumns, studentsSubTableColumns } from '@/app/pages/SchoolClassPage/studentsColumns';
import { challengesColumns, challengesSubTableColumns } from '@/app/pages/SchoolClassPage/challengesColumns';
import { DataTable } from '@/app/components/DataTable';
import { ActionDialog } from '@/app/components/ActionDialog';
import { ChallengeCard } from '@/app/components/ChallengeCard';

type Tab = 'students' | 'challenges';
type ChallengesDialogTab = 'my' | 'public';

type TeacherViewProps = {
  classId: string;
};

export const TeacherView = ({ classId }: TeacherViewProps) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('students');
  const [challengesDialogTab, setChallengesDialogTab] = useState<ChallengesDialogTab>('my');
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useUser();
  const queryClient = useQueryClient();

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

  const {
    publicChallenges,
    publicChallengesFetchNextPage,
    publicChallengesHasNextPage,
    publicChallengesIsFetchingNextPage
  } = usePublicChallenges();

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

  const studentsTableColumns = studentsColumns(completedSummary, classChallenges.length)
  const challengesTableColumns = challengesColumns(getStudentsSolvedCount, schoolClass?.students?.length ?? 0, schoolClass?.id!)

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

  const extractChallengeIdentifiers = (challenges: Challenge[]) => {
    return new Set(
      challenges.flatMap(challenge =>
        [challenge.id, challenge.originChallengeId].filter(Boolean)
      )
    );
  };

  const myAvailableChallenges = useMemo(() => {
    if (!myChallenges || !classChallenges) return [];

    const classChallengeIdentifiers = extractChallengeIdentifiers(classChallenges);

    return myChallenges.filter(challenge =>
      !classChallengeIdentifiers.has(challenge.id)
    );
  }, [myChallenges, classChallenges]);

  const filteredPublicChallenges = useMemo(() => {
    if (!publicChallenges || !classChallenges || !user) return [];

    const classChallengeIdentifiers = extractChallengeIdentifiers(classChallenges);

    return publicChallenges.filter(challenge =>
      challenge.creatorId !== user.id &&
      !classChallengeIdentifiers.has(challenge.id)
    );
  }, [publicChallenges, classChallenges, user]);


  const {
    open,
    setOpen,
    config,
    showDialog,
    handleConfirm,
  } = useActionDialog();

  const handleAddChallenge = (challenge: Challenge) => {
    if (challenge.creatorId !== user?.id) {
      handleCopyChallenge(challenge.id);
    } else {
      addChallenge({ challengeId: challenge.id });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setModalOpen(false);
    }
  };

  const handleCopyChallenge = async (id: string) => {
    showDialog({
      title: 'Copiar e usar desafio?',
      description: `O desafio deve ser copiado e adicionado aos seus desafios
        para poder adiciona-lo à turma.
        Isso garante um maior controle para o professor sobre ele.`,
      confirmLabel: 'Copiar e adicionar',
      variant: 'default',
      action: async () => {
        const response = await copyChallenge(id);
        queryClient.invalidateQueries({ queryKey: ['my-challenges'] });
        addChallenge({ challengeId: response.id });
      }
    });
  }

  const handleAddStudent = (id: string) => {
    addStudent({ studentId: id });
    queryClient.invalidateQueries({ queryKey: ['classes'] });
    setModalOpen(false);
  }

  const renderDialogChallenges = (challenges: Challenge[]) => (
    <ScrollArea
      className={cn(
        'flex flex-1',
        '[&_[data-radix-scroll-area-viewport]>div]:!block', {/* Evita display: table no SrollAreaViewport */}
      )}
    >
      <div className="pr-3 flex flex-wrap gap-4">
        {challenges.map((ch, index) => {
          const isLast = index === challenges.length - 1;

          return (
            <ChallengeCard
              key={ch.id}
              ref={isLast ? lastElementRef : undefined}
              actionLabel='Adicionar desafio'
              challenge={ch}
              fullWidth
              onAction={() => {
                handleAddChallenge(ch);
              }}
            />
          );
        })}

        {challengesIsFetchingNextPage && <Spinner className='m-auto' />}
      </div>
    </ScrollArea>
  );

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
        className="flex flex-col flex-1 space-y-3 overflow-hidden"
      >
        <TabsList className='gap-6'>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
        </TabsList>

        {/* Aba Alunos */}
        <TabsContent value="students" className='data-[state=active]:flex flex-col flex-1 overflow-hidden'>
          <DataTable
            data={classStudents}
            columns={studentsTableColumns}
            childColumns={(user) => studentsSubTableColumns(user, completedSummary)}
            children={classChallenges}
            searchPlaceholder="Buscar aluno..."
          />
        </TabsContent>

        {/* Aba Desafios */}
        <TabsContent value="challenges" className='data-[state=active]:flex flex-col flex-1 overflow-hidden'>
          <DataTable
            data={classChallenges}
            columns={challengesTableColumns}
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

        <DialogContent className="sm:max-w-2x2 h-full w-full max-h-[70vh] flex flex-col flex-1 overflow-hidden">
          <DialogHeader>
            <DialogTitle>{dialogContent[tab].title}</DialogTitle>
            <DialogDescription>{dialogContent[tab].description}</DialogDescription>
          </DialogHeader>

          {tab === 'challenges' && (
            <Tabs
              value={challengesDialogTab}
              onValueChange={(v) => setChallengesDialogTab(v as ChallengesDialogTab)}
              className="flex flex-col h-full flex-1 overflow-hidden"
            >
              <TabsList className="mb-3 gap-4">
                <TabsTrigger value="my">Meus desafios</TabsTrigger>
                <TabsTrigger value="public">Desafios públicos</TabsTrigger>
              </TabsList>

              <TabsContent value="my" className="data-[state=active]:flex flex-col flex-1 overflow-hidden">
                {renderDialogChallenges(myAvailableChallenges)}
              </TabsContent>

              <TabsContent value="public" className="data-[state=active]:flex flex-col flex-1 overflow-hidden">
                {renderDialogChallenges(filteredPublicChallenges)}
              </TabsContent>
            </Tabs>
          )}

          {tab === 'students' && (
            <ScrollArea
              className={cn(
                'flex flex-1',
                '[&_[data-radix-scroll-area-viewport]>div]:!block', {/* Evita display: table no SrollAreaViewport */}
              )}
            >
              <div className="pr-3 flex flex-wrap gap-4">
                {filterAvailableUsers().map(student => (
                  <Card key={student.id} className='p-6 w-full flex items-center justify-between'>
                    <CardHeader className='p-1 space-y-0 flex flex-col gap-2'>
                      <CardTitle>{student.name}</CardTitle>
                      <CardDescription>{student.email}</CardDescription>
                    </CardHeader>

                    <CardFooter className='p-0'>
                      <Button
                        size='sm'
                        disabled={addingStudent}
                        onClick={() => handleAddStudent(student.id)}
                      >
                        Adicionar aluno
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <ActionDialog
        open={open}
        onOpenChange={setOpen}
        title={config.title}
        description={config.description}
        confirmLabel={config.confirmLabel}
        variant={config.variant}
        onConfirm={handleConfirm}
        modal={false}
      />
    </>
  );
};
