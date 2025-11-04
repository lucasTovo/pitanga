import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon, LogOutIcon, UserIcon } from 'lucide-react';

import { SchoolClass, UserRole } from '@/types/schoolClass.types';
import { Challenge, ChallengeLevel } from '@/types/challenges.types';

import { listSchoolClasses } from '@/infra/data/shcool.rest';
import { listChallenges } from '@/infra/data/challenges.rest';

import { useAuth } from '@/auth/hook/useAuth';
import { useUser } from '../layouts/RootLayout';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
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
        setClasses(userSchoolClasses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSchoolClasses(false);
      }
    }
    getSchoolClasses();
  }, []);

  const difficultyLevelStyles: Record<ChallengeLevel, string> = {
    EASY: "bg-success text-success-foreground",
    MEDIUM: "bg-warning text-warning-foreground",
    HARD: "bg-accent text-accent-foreground",
    PRO: "bg-complementary text-complementary-foreground",
  }

  if (loadingChallenges) return <p>Carregando desafios...</p>;
  if (loadingSchoolClasses) return <p>Carregando turmas...</p>;

  return (
    <div className="p-3 space-y-6 flex flex-col h-screen">
      {/* Topo com informações do usuário */}
      <Card className="w-full">
        <CardHeader className='flex-row p-3 sm:p-6'>
          <Avatar className="w-16 h-16 object-cover mr-4">
            <AvatarImage className='rounded-full' src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>
              <UserIcon className='rounded-full border'/>
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-1">
                <UserIcon className="w-4 h-4" />
                {isTeacher ? 'Professor' : 'Aluno'}
              </Badge>
            </CardDescription>
          </div>

          <div className="ml-auto flex gap-2 ">
            <ModeToggle />
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOutIcon className="w-4 h-4" />
              Sair
            </Button>
          </div>

        </CardHeader>
      </Card>

      {/* Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}
        className="flex flex-col flex-1 space-y-4 overflow-hidden"
      >
        <TabsList className='gap-6'>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
          <TabsTrigger value="classes">Turmas</TabsTrigger>
        </TabsList>

        {/* Aba de desafios */}
        <TabsContent
          value="challenges"
          className='data-[state=active]:flex flex-col flex-1 overflow-hidden'
        >
          <ScrollArea className="flex flex-col flex-1">
            <div className="flex flex-wrap gap-4">
              {challenges.map(ch => (
                <Link
                  key={ch.id}
                  to={'/challenges/' + ch.id}
                  className="
                    block
                    w-full
                    sm:w-1/2
                    lg:w-1/3
                    xl:w-1/4
                    flex-grow
                    transition-transform origin-center hover:scale-[1.02]
                  "
                >
                  <Card className='h-full'>
                    <CardHeader className='pb-3'>
                      <CardTitle>{ch.title}</CardTitle>
                      <CardDescription>
                        <div dangerouslySetInnerHTML={{ __html: ch.description }} />
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Badge className={`${difficultyLevelStyles[ch.level]}`}>
                        {ch.level}
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </ScrollArea>

          <Button asChild className='my-4 w-full max-w-sm self-center'>
            <Link to={'/create-challenge'}>
              + Adicionar Desafio
            </Link>
          </Button>
        </TabsContent>

        {/* Aba de turmas */}
        <TabsContent
          value="classes"
          className='data-[state=active]:flex flex-col flex-1 overflow-hidden'
        >
          <ScrollArea className="flex flex-col flex-1">
            <div className="flex flex-wrap gap-4">
              {classes.map(cls => (
                <Link
                  key={cls.id}
                  to={`/classes/${cls.id}`}
                  className="
                    block
                    w-full
                    sm:w-1/2
                    lg:w-1/3
                    xl:w-1/4
                    flex-grow
                    transition-transform origin-center hover:scale-[1.02]
                  "
                >
                  <Card className='h-full'>
                    <CardHeader className='pb-3'>
                      <CardTitle>{cls.name}</CardTitle>
                      <CardDescription>{cls.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Badge variant="secondary" className='mr-2 text-sm font-bold'>
                        <UserIcon className='mr-1'/>
                        {cls.count.students}
                      </Badge>
                      <Badge variant="secondary" className='text-sm font-bold'>
                        <ClipboardListIcon className='mr-1'/>
                        {cls.count.challenges}
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </ScrollArea>

          {isTeacher && (
            <Button asChild className='my-4'>
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
