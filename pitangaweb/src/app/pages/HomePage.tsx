import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOutIcon, UserIcon } from 'lucide-react';

import { Challenge } from '@/types/challenges.types';
import { SchoolClass, UserRole } from '@/types/schoolClass.types';

import { listSchoolClasses } from '@/infra/data/shcool.rest';
import { listChallenges } from '@/infra/data/challenges.rest';

import { useAuth } from '@/auth/hook/useAuth';
import { useUser } from '../layouts/RootLayout';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>([]);
  const [activeTab, setActiveTab] = useState('challenges');
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingSchoolClasses, setLoadingSchoolClasses] = useState(true);

  const { user } = useUser();
  const isTeacher = user.role === UserRole.TEACHER;

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

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
    <div className="p-2 space-y-6">
      {/* Topo com informações do usuário */}
      <Card className="w-full">
        <CardHeader className='flex-row'>
          <Avatar className="w-16 h-16 object-cover mr-4">
            <AvatarImage className='rounded-full' src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>
              <UserIcon className='rounded-full border' size='md'></UserIcon>
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="flex items-center gap-1 mt-1">
                <UserIcon className="w-4 h-4" />
                {isTeacher ? 'Professor' : 'Aluno'}
              </Badge>
            </CardDescription>
          </div>

          <Button
            variant="destructive"
            className="ml-auto"
            onClick={handleLogout}
          >
            <LogOutIcon className="w-4 h-4" />
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
        <TabsContent
          value="challenges"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {challenges.map(ch => (
            <Link
              key={ch.id}
              to={'/challenges/' + ch.id}
              className="block transition-transform hover:scale-[1.02]"
            >
              <Card key={ch.id}>
                <CardHeader className='pb-3'>
                  <CardTitle>{ch.title}</CardTitle>
                  <CardDescription>
                    <div dangerouslySetInnerHTML={{ __html: ch.description }} />
                  </CardDescription>
                </CardHeader>
                <CardFooter>{ch.level}</CardFooter>
              </Card>
            </Link>
          ))}

          <Button asChild>
            <Link to={'/create-challenge'}>
              + Adicionar Desafio
            </Link>
          </Button>
        </TabsContent>

        {/* Aba de turmas */}
        <TabsContent
          value="classes"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {schoolClasses.map(cls => (
            <Link
              key={cls.id}
              to={`/classes/${cls.id}`}
              className="block transition-transform hover:scale-[1.02]"
            >
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>{cls.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  Alunos: {cls.count.students} | Desafios: {cls.count.challenges}
                </CardFooter>
              </Card>
            </Link>
          ))}

          {isTeacher && (
            <Button asChild>
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
