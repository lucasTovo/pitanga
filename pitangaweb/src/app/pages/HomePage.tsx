import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardListIcon, ListTodoIcon, LogOutIcon, PencilIcon, Trash2Icon, UserIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { Challenge } from '@/types/challenges.types';
import { SchoolClass, UserRole } from '@/types/school-class.types';

import { listSchoolClasses } from '@/infra/data/shcool.rest';
import { deleteChallenge } from '@/infra/data/challenges.rest';

import { useAuth } from '@/hooks/useAuth';
import { useUser } from '../layouts/RootLayout';
import { useChallenges } from '@/hooks/useChallenges';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from "@/components/ui/spinner"
import { ModeToggle } from '@/components/mode-toggle';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ButtonGroup } from '@/components/ui/button-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DifficultyLevelBadge } from '../components/DifficultyLevelBadge';

export const HomePage = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [activeTab, setActiveTab] = useState('challenges');
  const [loadingSchoolClasses, setLoadingSchoolClasses] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<(() => void) | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChallenges();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const isTeacher = user.role === UserRole.TEACHER;

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

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

  const challenges = data?.pages.flatMap((page) => page.content) ?? [];

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

  const handleDialog = (action: () => void) => {
    setDialogOpen(true);
    setDialogAction(() => action);
  };

  const handleDeleteChallenge = async (challenge: Challenge) => {
    await deleteChallenge(challenge.id);
    queryClient.invalidateQueries({ queryKey: ["challenges"] });
    setDialogOpen(false);
  };

  if (loadingSchoolClasses) return <p>Carregando turmas...</p>;
  if (status === 'pending') return <p>Carregando desafios...</p>;
  if (status === 'error') return <p>Erro ao carregar desafios.</p>;

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Topo com informações do usuário */}
      <Card className="w-full">
        <CardHeader className='relative flex-row space-y-0 p-3 sm:p-5 pt-8 pb-6'>
          <div className='flex items-center'>
            <Avatar className="w-14 h-14 object-cover mr-3">
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
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
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
          <ScrollArea className="flex flex-col flex-1" >
            <div className="flex flex-wrap gap-4">
              {challenges.map((ch, index) => {
                const isLast = index === challenges.length - 1;
                return(
                    <Card
                      key={ch.id}
                      ref={isLast ? lastItemRef : null}
                      className="
                        block
                        w-full
                        sm:w-[calc(50%-1rem)]
                        lg:w-[calc(33.333%-1rem)]
                      "
                    >
                      <CardHeader className='px-6 py-4 flex flex-row space-y-0 justify-between'>
                        <div>
                          <CardTitle className='mb-2 overflow-hidden text-ellipsis'>{ch.title}</CardTitle>
                          <CardDescription className=''>
                            <DifficultyLevelBadge level={ch.level} />
                          </CardDescription>
                        </div>
                        <ButtonGroup>
                          <Button
                            size='icon'
                            variant="outline"
                            className="hover:bg-secondary"
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            size='icon'
                            variant="outline"
                            className="hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDialog(() => handleDeleteChallenge(ch))}
                          >
                            <Trash2Icon />
                          </Button>
                        </ButtonGroup>
                      </CardHeader>
                      <Separator className="" />
                      <CardFooter className='px-6 py-2 flex justify-between'>
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
                          <Button onClick={() => navigate(`/challenges/${ch.id}`)} size='sm'>
                            Acessar
                          </Button>
                      </CardFooter>
                    </Card>
                )
              })}

              {isFetchingNextPage && (
                <Spinner className='m-auto' />
              )}
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
                    flex-grow-0
                    flex-shrink-0
                    sm:w-[calc(50%-1rem)]
                    lg:w-[calc(33.333%-1rem)]
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
            <Button asChild className='my-4 w-full max-w-sm self-center'>
              <Link to={'/create-class'}>
                + Adicionar Turma
              </Link>
            </Button>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-center'>Excluir desafio?</DialogTitle>
            <DialogDescription className='text-center'>
              Esta ação não poderá ser revertida.
              <br/>
              O desafio será excluido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            <DialogClose asChild>
              <Button variant="outline" className="hover:bg-secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={dialogAction ?? (() => {})} variant="destructive">
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}
