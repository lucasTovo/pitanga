import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftFromLineIcon, ClipboardListIcon, ListTodoIcon, PlusIcon, UserIcon } from 'lucide-react';

import { useUser } from '@/app/hooks/useUser';
import { useChallenges } from '@/app/hooks/useChallenges';
import { useAllStudents } from '@/app/hooks/useAllStudents';
import { useSchoolClass } from '@/app/hooks/useSchoolClass';
import { useClassStudents } from '@/app/hooks/useClassStudents';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import { useClassChallenges } from '@/app/hooks/useClassChallenges';
import { useCompletedSummary } from '@/app/hooks/useCompletedSummary';
import { useAddStudentToSchoolClass } from '@/app/hooks/useAddStudentToSchoolClass';
import { useAddChallengeToSchoolClass } from '@/app/hooks/useAddChallengeToSchoolClass';

import { studentsColumns } from '@/app/pages/SchoolClassPage/studentsColumns';
import { challengesColumns } from '@/app/pages/SchoolClassPage/challengesColumns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataTable } from '@/app/components/DataTable';
import { ChallengeCard } from '@/app/components/ChallengeCard';
import { DifficultyLevelBadge } from '@/app/components/DifficultyLevelBadge';

type Tab = 'students' | 'challenges';

export const SchoolClassPage = () => {
  const [tab, setTab] = useState<Tab>('students');
  const [modalOpen, setModalOpen] = useState(false);

  const { classId } = useParams();
  const navigate = useNavigate();

  const { isTeacher } = useUser();

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
  }

  const getStudentsSolvedCount = (challengeId: string) => {
    if (!completedSummary) return 0;

    return Object.values(completedSummary).reduce((count, student) => {
      if (student.completedChallenges?.includes(challengeId)) {
        return count + 1;
      }
      return count;
    }, 0);
  }

  const dialogContent: Record<Tab, { button: string; title: string; loadingMsg: string }> = {
    students: {
      button: 'Adicionar aluno á turma',
      title: 'Escolha um aluno para adicionar',
      loadingMsg: 'Carregando alunos...',
    },
    challenges: {
      button: 'Adicionar desafio á turma',
      title: 'Escolha um desafio para adicionar',
      loadingMsg: 'Carregando desafios...',
    }
  }

  if (schoolClassIsLoading) return <p>Carregando...</p>;
  if (schoolClassIsError || !schoolClass) return <p>Erro</p>;

  if (schoolClassIsLoading ||
    classChallengesIsLoading ||
    classStudentsIsLoading ||
    allStudentsIsLoading
  ) return <p>Carregando...</p>;

  if (schoolClassIsError ||
    classChallengesIsError ||
    classStudentsIsError ||
    allStudentsIsError
  ) return <p>Erro</p>;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className='flex gap-2'>
        <Button
          className='h-auto'
          onClick={() => navigate('/')}
        >
          <ArrowLeftFromLineIcon/>
        </Button>

        <Card className="w-full flex flex-col">
          <CardHeader className='grow'>
            <CardTitle>{schoolClass.name}</CardTitle>
          </CardHeader>
          <Separator/>
          <CardFooter className='py-3 px-6'>
            <div className='flex flex-row gap-2 items-start'>
              <Badge variant="outline" className='text-sm font-bold text-primary border-2 border-primary'>
                <UserIcon className='mr-1' />
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

      {/* Abas */}
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
        <TabsContent
          value="students"
          className='data-[state=active]:flex flex-col flex-1 overflow-hidden'
        >
          <ScrollArea className="flex flex-col flex-1">
            <DataTable
              columns={studentsColumns(completedSummary, classChallenges.length)}
              data={classStudents}
              searchPlaceholder="Buscar aluno..."
            />
          </ScrollArea>
        </TabsContent>

        {/* Aba Desafios */}
        <TabsContent
          value="challenges"
          className='data-[state=active]:flex flex-col flex-1 overflow-hidden'
        >
          <ScrollArea className="flex flex-col flex-1">
            {isTeacher ?
              <DataTable
                columns={challengesColumns(getStudentsSolvedCount, schoolClass.students.length)}
                data={classChallenges}
                searchPlaceholder="Buscar desafio..."
              />
            :
              <div className="flex flex-wrap gap-4">
                {classChallenges.map((ch) => {
                  return(
                    <Card
                      key={ch.id}
                      className="
                        flex
                        w-full
                        flex-col
                        sm:w-[calc(50%-1rem)]
                        lg:w-[calc(33.333%-1rem)]
                      "
                    >
                      <CardHeader
                        className='px-6 py-4 flex flex-row grow gap-2 space-y-0 justify-between'
                      >
                        <div className='flex flex-col justify-between'>
                          <CardTitle className='mb-2'>
                            {ch.title}
                          </CardTitle>
                          <CardDescription>
                            <DifficultyLevelBadge level={ch.level} />
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <Separator/>
                      <CardFooter className='px-6 py-2 flex justify-between'>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button disabled={!ch.description.trim()} size='sm'>
                              <ListTodoIcon />
                              Descrição
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='p-4'>
                            <div
                              className='revert-all'
                              dangerouslySetInnerHTML={{ __html: ch.description }}
                            />
                          </PopoverContent>
                        </Popover>
                        <Button onClick={() => navigate(`/challenges/${ch.id}`)} size='sm'>
                          Acessar
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            }
          </ScrollArea>
        </TabsContent>
      </Tabs>

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
          </DialogHeader>
          <ScrollArea className="flex flex-col flex-1">
            <div className="flex flex-col gap-4">
              {tab === 'challenges' && (
                <>
                  {myChallenges.map((ch, index) => {
                    const isLast = index === myChallenges.length - 1;
                    return(
                      <ChallengeCard
                        key={ch.id}
                        ref={isLast ? lastElementRef : undefined}
                        actionLabel='Adicionar desafio'
                        challenge={ch}
                        fullWidth
                        onAction={() => {
                          addChallenge({ challengeId: ch.id })
                          setModalOpen(false)
                        }}
                      />
                    )
                  })}

                  {challengesIsFetchingNextPage && (
                    <Spinner className='m-auto' />
                  )}
                </>
              )}

              {tab === 'students' && (
                allStudentsIsLoading ? (
                  <p>{dialogContent[tab].loadingMsg}</p>
                ) : filterAvailableUsers().map(student => (
                  <Card key={student.id} className='p-6 flex items-center justify-between'>
                    <CardHeader className='p-1 space-y-0 flex flex-col gap-2'>
                      <CardTitle>{student.name}</CardTitle>
                      <CardDescription>
                        {student.email}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className='p-0'>
                      <Button
                        size='sm'
                        onClick={() => {
                          addStudent({ studentId: student.id })
                          setModalOpen(false)
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
    </div>
  );
}
