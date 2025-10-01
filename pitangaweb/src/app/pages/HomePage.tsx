import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

import { useAuth } from "@/auth/hook/useAuth";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Challenge } from "@/types/challenges.types";
import { SchoolClass, User, UserRole } from "@/types/schoolClass.types";

import { listSchoolClasses } from "@/infra/data/shcool.rest";
import { listChallenges } from "@/infra/data/challenges.rest";

export function HomePage() {
  const user = useLoaderData() as User;
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>([]);
  const [activeTab, setActiveTab] = useState('challenges');
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingSchoolClasses, setLoadingSchoolClasses] = useState(true);

  const isTeacher = user.role === UserRole.TEACHER;

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  }

  useEffect(() => {
    async function getChallenges() {
      setLoadingChallenges(true);
      try {
        const userChallenges = await listChallenges(); // ajustar se precisar filtrar por criador
        setChallenges(userChallenges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChallenges(false);
      }
    }
    getChallenges();
  }, []);

  useEffect(() => {
    async function getSchoolClasses() {
      setLoadingSchoolClasses(true);
      try {
        const userSchoolClasses = await listSchoolClasses();
        setSchoolClasses(userSchoolClasses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSchoolClasses(false);
      }
    }
    getSchoolClasses();
  }, []);

  if (loadingChallenges) return <p>Carregando desafios...</p>;
  if (loadingSchoolClasses) return <p>Carregando turmas...</p>;

  return (
    <div className="p-4 space-y-6">
      {/* Topo com informações do usuário */}
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <p>{user.email}</p>
          {isTeacher && <p>Turmas criadas: {schoolClasses.length}</p>}
          <Button variant="destructive" onClick={handleLogout}>
            Sair
          </Button>
        </CardHeader>
      </Card>

      {/* Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
          <TabsTrigger value="classes">Turmas</TabsTrigger>
        </TabsList>

        {/* Aba de desafios */}
        <TabsContent value="challenges" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map(ch => (
            <Link key={ch.id} to={'/challenges/' + ch.id}>
              <Card key={ch.id}>
                <CardHeader>
                  <CardTitle>{ch.title}</CardTitle>
                  <p>{ch.level}</p>
                </CardHeader>
                <CardContent>
                  <div dangerouslySetInnerHTML={{ __html: ch.description }} />
                  {isTeacher && <button className="btn btn-primary mt-2">Criar Novo Desafio</button>}
                </CardContent>
              </Card>
            </Link>
          ))}
          <Button asChild className="self-start">
            <Link to="/create-challenge">+ Adicionar Desafio</Link>
          </Button>
        </TabsContent>

        {/* Aba de turmas */}
        <TabsContent value="classes" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schoolClasses.map(cls => (
            <Link
              key={cls.id}
              to={`/classes/${cls.id}`}
              className="block transition-transform hover:scale-[1.02]"
            >
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                  <p>{cls.description}</p>
                  <p>Alunos: {cls.count.students} | Desafios: {cls.count.challenges}</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {isTeacher && (
            <Button asChild className="self-start">
              <Link to={'/create-class'}>
                + Adicionar Turma
              </Link>
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div >
  );
}
