import { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftFromLineIcon, ClipboardListIcon, ListTodoIcon, PlusIcon, UserIcon } from 'lucide-react';

import { User } from '@/types/school-class.types';
import type { Challenge } from '@/types/challenges.types';

import { useChallenges } from '@/app/hooks/useChallenges';
import { useAllStudents } from '../hooks/useAllStudents';
import { useSchoolClass } from '../hooks/useSchoolClass';
import { useClassStudents } from '../hooks/useClassStudents';
import { useClassChallenges } from '../hooks/useClassChallenges';
import { useCompletedSummary } from '../hooks/useCompletedSummary';
import { useAddStudentToSchoolClass } from '../hooks/useAddStudentToSchoolClass';
import { useAddChallengeToSchoolClass } from '../hooks/useAddChallengeToSchoolClass';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DifficultyLevelBadge } from '../components/DifficultyLevelBadge';

type Tab = 'students' | 'challenges';

export const SchoolClassPage = () => {
  const [tab, setTab] = useState<Tab>('students');
  const [modalOpen, setModalOpen] = useState(false);

  const { classId } = useParams();
  const navigate = useNavigate();

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

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!challengesHasNextPage) return; // evita observar se já chegou ao fim

      // desconecta o observador anterior
      if (observer.current) observer.current.disconnect();

      // cria um novo observer
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          challengesFetchNextPage();
        }
      });

      // começa a observar o novo nó
      if (node) observer.current.observe(node);
    },
    [challengesHasNextPage, challengesFetchNextPage]
  );

  const filterAvailableUsers = () => {
    const assignedIds = new Set(classStudents.map(student => student.id));
    return allStudents.filter(student => !assignedIds.has(student.id));
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
            <Badge variant="secondary" className='mr-2 text-sm font-bold'>
              <UserIcon className='mr-1'/>
              {classStudents.length}
            </Badge>
            <Badge variant="secondary" className='text-sm font-bold'>
              <ClipboardListIcon className='mr-1'/>
              {classChallenges.length}
            </Badge>
          </CardFooter>
        </Card>
      </div>

      {/* Abas */}
      <Tabs defaultValue={tab} onValueChange={(value) => setTab(value as Tab)} className="flex flex-col flex-1 space-y-4 overflow-hidden">
        <TabsList className='gap-6'>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
        </TabsList>

        {/* Aba Alunos */}
        <TabsContent value="students" className='data-[state=active]:flex flex-col flex-1 overflow-hidden'>
          <ScrollArea className="flex flex-col flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Desafios Concluídos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((student: User) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="text-right">{`${completedSummary?.[student.id].count}/${classChallenges.length}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </TabsContent>

        {/* Aba Desafios */}
        <TabsContent value="challenges" className='data-[state=active]:flex flex-col flex-1 overflow-hidden'>
          <ScrollArea className="flex flex-col flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Desafio</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead className="text-right">Alunos que resolveram</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classChallenges.map((challenge: Challenge) => (
                  <TableRow key={challenge.id}>
                    <TableCell>{challenge.title}</TableCell>
                    <TableCell>
                      <DifficultyLevelBadge level={challenge.level} />
                    </TableCell>
                    {/* <TableCell>{challenge.completedBy}/{classInfo.totalStudents}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild className='block w-full max-w-sm mx-auto'>
          <Button variant="outline" className='flex'>
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
                      <Card
                        key={ch.id}
                        ref={isLast ? lastItemRef : null}
                        className="flex flex-col w-full"
                      >
                        <div className='px-6 py-4 flex items-center'>
                          <CardHeader className='p-0 flex flex-col justify-between grow gap-2 space-y-0'>
                            <CardTitle className='mb-2'>
                              {ch.title}
                            </CardTitle>
                            <CardDescription>
                              <DifficultyLevelBadge level={ch.level} />
                            </CardDescription>
                          </CardHeader>
                          <Button
                            size='sm'
                            onClick={() => {
                              addChallenge({ challengeId: ch.id })
                              setModalOpen(false)
                            }}
                          >
                            Adicionar
                          </Button>
                        </div>
                        <Separator/>
                        <CardFooter className='px-6 py-2'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button disabled={!ch.description} size='sm'>
                                <ListTodoIcon />
                                Descrição
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='p-4'>
                              <div className='revert-all' dangerouslySetInnerHTML={{ __html: ch.description }} />
                            </PopoverContent>
                          </Popover>
                        </CardFooter>
                      </Card>
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
                    <CardHeader className='p-0 space-y-0'>
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
                        Adicionar
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
