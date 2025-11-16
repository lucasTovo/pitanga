import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ArrowLeftFromLineIcon, ClipboardListIcon, PlusIcon, UserIcon } from 'lucide-react';

import type { SchoolClass, User } from '@/types/school-class.types';
import type { Challenge } from '@/types/challenges.types';

import { getChallengeById } from '@/infra/data/challenges.rest';
import { addChallengeToSchoolClass, addStudentToSchoolClass, getUser, listUsers } from '@/infra/data/shcool.rest';

import { useChallenges } from '@/hooks/useChallenges';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DifficultyLevelBadge } from '../components/DifficultyLevelBadge';

type Tab = 'students' | 'challenges';

export const SchoolClassPage = () => {
  const schoolClass = useLoaderData() as SchoolClass;
  const [classStudents, setClassStudents] = useState<User[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [classChallenges, setClassChallenges] = useState<Challenge[]>([]);
  const [tab, setTab] = useState<Tab>('students');
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAllStudents, setLoadingAllStudents] = useState(true);
  const [loadingChallenges, setLoadingChallenges] = useState(true);

  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useChallenges();
  const myChallenges = data?.pages.flatMap((page) => page.content) ?? [];

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!hasNextPage) return; // evita observar se já chegou ao fim

      // desconecta o observador anterior
      if (observer.current) observer.current.disconnect();

      // cria um novo observer
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });

      // começa a observar o novo nó
      if (node) observer.current.observe(node);
    },
    [hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    async function getClassStudents() {
      try {
        const results = await Promise.all(schoolClass.students.map(id => getUser(id)));
        const students = results.filter((u): u is User => Boolean(u));
        setClassStudents(students);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoadingStudents(false);
      }
    }

    if (!schoolClass?.students?.length) {
      setLoadingStudents(false);
      return;
    }

    getClassStudents();
  }, []);

  useEffect(() => {
    async function getAllStudents() {
      try {
        const students = await listUsers();
        setAllStudents(students);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoadingAllStudents(false);
      }
    }

    getAllStudents();
  }, []);

  useEffect(() => {
    async function getClassChallenges() {
      try {
        const results = await Promise.all(schoolClass.challenges.map(id => getChallengeById(id)));
        const challenges = results.filter((u): u is Challenge => Boolean(u));
        setClassChallenges(challenges);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoadingChallenges(false);
      }
    }

    if (!schoolClass?.challenges?.length) {
      setLoadingChallenges(false);
      return;
    }

    getClassChallenges();
  }, []);

  const handleAddchallenge = async (challenge: Challenge) => {
    await addChallengeToSchoolClass(schoolClass.id, challenge.id);
    setClassChallenges([...classChallenges, challenge])
  }

  const handleAddStudent = async (student: User) => {
    await addStudentToSchoolClass(schoolClass.id, student.id);
    setClassStudents([...classStudents, student]);
  }

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

  if (loadingStudents || loadingAllStudents) return <p>Carregando alunos...</p>;
  if (loadingChallenges) return <p>Carregando desafios...</p>;

  if (!schoolClass) {
    return <p className="text-center text-red-500">Turma não encontrada</p>;
  }

  return (
    <div className="p-3 space-y-6 flex flex-col h-full">
      <div className='flex gap-2'>
        <Button
          className='h-auto'
          onClick={() => navigate(-1)}
        >
          <ArrowLeftFromLineIcon/>
        </Button>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{schoolClass.name}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Badge variant="secondary" className='mr-2 text-sm font-bold'>
              <UserIcon className='mr-1'/>
              {classChallenges.length}
            </Badge>
            <Badge variant="secondary" className='text-sm font-bold'>
              <ClipboardListIcon className='mr-1'/>
              {classStudents.length}
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
                    {/* <TableCell>{student.completedChallenges}/{classInfo.totalChallenges}</TableCell> */}
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
        <DialogContent className="sm:max-w-2xl w-full max-h-[70vh] flex flex-col flex-1 overflow-hidden">
          <DialogHeader>
            <DialogTitle>{dialogContent[tab].title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex flex-col flex-1">
            <div className="flex flex-col gap-4">
              {tab === 'challenges' && (
                <>
                  {myChallenges.map((challenge, index) => {
                    const isLast = index === myChallenges.length - 1;
                    return(
                      <Card
                        key={challenge.id}
                        ref={isLast ? lastItemRef : null}
                        onClick={() => {
                        handleAddchallenge(challenge)
                        setModalOpen(false)
                      }}>
                        <CardHeader className='flex'>
                          <CardTitle>{challenge.title}</CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <DifficultyLevelBadge level={challenge.level} />
                        </CardFooter>
                      </Card>
                    )
                  })}

                  {isFetchingNextPage && (
                    <Spinner className='m-auto' />
                  )}
                </>
              )}

              {tab === 'students' && (
                loadingAllStudents ? (
                  <p>{dialogContent[tab].loadingMsg}</p>
                ) : filterAvailableUsers().map(student => (
                  <Card key={student.id} onClick={() => {
                    handleAddStudent(student)
                    setModalOpen(false)
                  }}>
                    <CardHeader>
                      <CardTitle>{student.name}</CardTitle>
                      <p>{student.email}</p>
                    </CardHeader>
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
