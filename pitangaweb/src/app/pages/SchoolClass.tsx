import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { SchoolClass, User } from "@/types/schoolClass.types";
import { Challenge } from "@/types/challenges.types";

import { getUser } from "@/infra/data/shcool.rest";
import { getChallengeById } from "@/infra/data/challenges.rest";

export default function SchoolClass() {
  const schoolClass = useLoaderData() as SchoolClass;
  const [students, setStudents] = useState<User[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoading] = useState(true);

  useEffect(() => {
    async function getStudents() {
      try {
        const results = await Promise.all(schoolClass.students.map(id => getUser(id)));
        const students = results.filter((u): u is User => Boolean(u));
        setStudents(students);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoadingStudents(false);
      }
    }

    if (schoolClass.students.length) {
      getStudents();
    }

  }, [schoolClass.students]);

  useEffect(() => {
    async function getChallenges() {
      try {
        const results = await Promise.all(schoolClass.challenges.map(id => getChallengeById(id)));
        const challenges = results.filter((u): u is Challenge => Boolean(u));
        setChallenges(challenges);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }

    if (schoolClass.students.length) {
      getChallenges();
    }

  }, [schoolClass.students]);

  if (loadingStudents) return <p>Carregando alunos...</p>;
  if (loadingChallenges) return <p>Carregando desafios...</p>;

  if (!schoolClass) {
    return <p className="text-center text-red-500">Turma não encontrada</p>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Informações gerais */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
        <div>Desafios Disponíveis: {schoolClass.count.challenges}</div>
        {/* <div>Alunos que concluíram todos: {classInfo.studentsCompletedAll}/{classInfo.totalStudents}</div> */}
      </div>

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
        </TabsContent>
      </Tabs>
    </div>
  );
}
