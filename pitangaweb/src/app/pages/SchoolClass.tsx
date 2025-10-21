import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { DialogOverlay } from '@radix-ui/react-dialog';

import type { SchoolClass, User } from '@/types/schoolClass.types';
import type { Challenge } from '@/types/challenges.types';

import { addChallengeToSchoolClass, getUser } from '@/infra/data/shcool.rest';
import { getChallengeById, listChallenges } from '@/infra/data/challenges.rest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


export default function SchoolClass() {
  const schoolClass = useLoaderData() as SchoolClass;
  const [students, setStudents] = useState<User[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [loadingMyChallenges, setLoadingMyChallenges] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddchallenge = async (challenge: Challenge) => {
    await addChallengeToSchoolClass(schoolClass.id, challenge.id);
    setChallenges([...challenges, challenge])
  }

  useEffect(() => {
    async function getStudents() {
      try {
        const results = await Promise.all(schoolClass.students.map(id => getUser(id)));
        const students = results.filter((u): u is User => Boolean(u));
        setStudents(students);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoadingStudents(false);
      }
    }

    if (!schoolClass.students.length) {
      setLoadingStudents(false);
      return;
    }

    getStudents();
  }, [schoolClass.students]);

  useEffect(() => {
    async function getChallenges() {
      try {
        const results = await Promise.all(schoolClass.challenges.map(id => getChallengeById(id)));
        const challenges = results.filter((u): u is Challenge => Boolean(u));
        setChallenges(challenges);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoadingChallenges(false);
      }
    }

    if (!schoolClass.challenges.length) {
      setLoadingChallenges(false);
      return;
    }

    getChallenges();
  }, [schoolClass.challenges]);

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

  if (loadingStudents) return <p>Carregando alunos...</p>;
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
            <p className="text-sm text-muted-foreground">Desafios: {challenges.length}</p>
            <p className="text-sm text-muted-foreground">Alunos: {schoolClass.count.students}</p>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Abas */}
      <Tabs defaultValue="students" className="space-y-4">
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
              {students.map((student: User) => (
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
              {challenges.map((challenge: Challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>{challenge.title}</TableCell>
                  <TableCell>{challenge.level}</TableCell>
                  {/* <TableCell>{challenge.completedBy}/{classInfo.totalStudents}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">+ Adicionar desafio á turma</Button>
            </DialogTrigger>
            <DialogOverlay>
              {/* <DialogContent className="sm:max-w-[425px]"> */}
              <DialogContent className="sm:max-w-2xl w-full max-h-[70vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Escolha um desafio para adicionar</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="mt-4 overflow-y-auto px-2" style={{ maxHeight: 'calc(70vh - 6rem)' }}>
                  {loadingMyChallenges ? (
                    <p>Carregando desafios...</p>
                  ) : myChallenges.map(ch => (
                    <Card key={ch.id} onClick={() => {
                      handleAddchallenge(ch)
                      setModalOpen(false)
                    }}>
                      <CardHeader>
                        <CardTitle>{ch.title}</CardTitle>
                        <p>{ch.level}</p>
                      </CardHeader>
                    </Card>
                  ))}

                </div>
              </DialogContent>
            </DialogOverlay>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
