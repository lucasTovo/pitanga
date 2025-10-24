import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { DialogOverlay } from '@radix-ui/react-dialog';

import type { SchoolClass, User } from '@/types/schoolClass.types';
import type { Challenge } from '@/types/challenges.types';

import { addChallengeToSchoolClass, addStudentToSchoolClass, getUser, listUsers } from '@/infra/data/shcool.rest';
import { getChallengeById, listChallenges } from '@/infra/data/challenges.rest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Tab = 'students' | 'challenges';

export default function SchoolClass() {
  const schoolClass = useLoaderData() as SchoolClass;
  const [classStudents, setClassStudents] = useState<User[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [classChallenges, setClassChallenges] = useState<Challenge[]>([]);
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [tab, setTab] = useState<Tab>('students');
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAllStudents, setLoadingAllStudents] = useState(true);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingMyChallenges, setLoadingMyChallenges] = useState(true);

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

  useEffect(() => {
    async function getMyChallenges() {
      setLoadingMyChallenges(true);
      try {
        const challenges = await listChallenges();
        setMyChallenges(challenges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMyChallenges(false);
      }
    }

    getMyChallenges();
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
      button: '+ Adicionar aluno á turma',
      title: 'Escolha um aluno para adicionar',
      loadingMsg: 'Carregando alunos...',
    },
    challenges: {
      button: '+ Adicionar desafio á turma',
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
    <div className="p-6 space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{schoolClass.name}</CardTitle>
          <CardDescription>
            <p className="text-sm text-muted-foreground">Desafios: {classChallenges.length}</p>
            <p className="text-sm text-muted-foreground">Alunos: {classStudents.length}</p>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Abas */}
      <Tabs defaultValue={tab} onValueChange={(value) => setTab(value as Tab)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
        </TabsList>

        {/* Aba Alunos */}
        <TabsContent value="students">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Desafios Concluídos</TableHead>
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
        </TabsContent>

        {/* Aba Desafios */}
        <TabsContent value="challenges">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Desafio</TableHead>
                <TableHead>Dificuldade</TableHead>
                <TableHead>Alunos que resolveram</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classChallenges.map((challenge: Challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>{challenge.title}</TableCell>
                  <TableCell>{challenge.level}</TableCell>
                  {/* <TableCell>{challenge.completedBy}/{classInfo.totalStudents}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{dialogContent[tab].button}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl w-full max-h-[70vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{dialogContent[tab].title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="mt-4 overflow-y-auto px-2" style={{ maxHeight: 'calc(70vh - 6rem)' }}>
            {tab === 'challenges' && (
              loadingMyChallenges ? (
                <p>{dialogContent[tab].loadingMsg}</p>
              ) : myChallenges.map(challenge => (
                <Card key={challenge.id} onClick={() => {
                  handleAddchallenge(challenge)
                  setModalOpen(false)
                }}>
                  <CardHeader>
                    <CardTitle>{challenge.title}</CardTitle>
                    <p>{challenge.level}</p>
                  </CardHeader>
                </Card>
              ))
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
