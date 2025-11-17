import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardListIcon, ListTodoIcon, LogOutIcon, PencilIcon, PlusIcon, Trash2Icon, UserIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { SchoolClass, UserRole } from '@/types/school-class.types';

import { deleteSchoolClass } from '@/infra/data/school.rest';
import { orchestratorRest } from '@/infra/data/orchestrator.rest';

import { useAuth } from '@/hooks/useAuth';
import { useUser } from '../layouts/RootLayout';
import { useChallenges } from '@/app/hooks/useChallenges';
import { useActionDialog } from '../hooks/useActionDialog';
import { useSchoolClasses } from '../hooks/useSchoolClasses';

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
import { ActionDialog } from '../components/ActionDialog';
import { DifficultyLevelBadge } from '../components/DifficultyLevelBadge';
import { SchoolClassFormDialog } from '../components/SchoolClassFormDialog';

export const HomePage = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [activeTab, setActiveTab] = useState('challenges');
  const [loadingSchoolClasses, setLoadingSchoolClasses] = useState(true);
  const [dialogSchoolClasFormOpen, setDialogSchoolClasFormOpen] = useState(false);
  const [dialogSchoolClasFormMode, setDialogSchoolClasFormMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  const { user } = useUser();
  const isTeacher = user?.role === UserRole.TEACHER;

  const {
    open,
    setOpen,
    config,
    showDialog,
    handleConfirm
  } = useActionDialog();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChallenges();

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

  const handleCreateSchoolClass = () => {
    setDialogSchoolClasFormMode("create");
    setSelectedClass(null);
    setDialogSchoolClasFormOpen(true);
  }

  const handleEditSchoolClass = (schoolClass: SchoolClass) => {
    setDialogSchoolClasFormMode("edit");
    setSelectedClass(schoolClass);
    setDialogSchoolClasFormOpen(true);
  }

  const updateSchoolClassList = (
    prev: any[],
    response: any,
    mode: "create" | "edit"
  ) => {
    if (mode === "create") {
      return [...prev, response];
    }

    return prev.map((c) => (c.id === response.id ? response : c));
  }

  function handleDeleteChallenge(id: string) {
    showDialog({
      title: 'Excluir desafio?',
      description: `Esta ação não poderá ser revertida.
        O desafio será excluido permanentemente.`,
      confirmLabel: 'Excluir',
      variant: 'destructive',
      action: async () => {
        await orchestratorRest.deleteChallengeCascade(id);
        queryClient.invalidateQueries({ queryKey: ['challenges'] });
      },
    });
  }

  function handleDeleteClass(id: string) {
    showDialog({
      title: 'Excluir turma?',
      description: `Esta ação não poderá ser revertida.
        A turma será excluida permanentemente.`,
      confirmLabel: 'Excluir',
      variant: 'destructive',
      action: async () => {
        await deleteSchoolClass(id);
        setClasses((prev) => prev.filter((cls) => cls.id !== id)); //temporario
      },
    });
  }

  const handleEditChallenge = (id: string) => {
    navigate(`/challenges/${id}/edit`);
  }

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
                        flex
                        w-full
                        flex-col
                        sm:w-[calc(50%-1rem)]
                        lg:w-[calc(33.333%-1rem)]
                      "
                    >
                      <CardHeader className='px-6 py-4 flex flex-row grow gap-2 space-y-0 justify-between'>
                        <div className='flex flex-col justify-between'>
                          <CardTitle className='mb-2 overflow-hidden text-ellipsis'>
                            {ch.title}
                          </CardTitle>
                          <CardDescription>
                            <DifficultyLevelBadge level={ch.level} />
                          </CardDescription>
                        </div>
                        <ButtonGroup>
                          <Button
                            size='icon'
                            variant="outline"
                            className="hover:bg-secondary"
                            onClick={() => handleEditChallenge(ch.id)}
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            size='icon'
                            variant="outline"
                            className="hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteChallenge(ch.id)}
                          >
                            <Trash2Icon />
                          </Button>
                        </ButtonGroup>
                      </CardHeader>
                      <Separator/>
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

          <Button onClick={() => navigate('/challenges/create')} className='my-4 w-full max-w-sm self-center'>
            <PlusIcon />
            Adicionar Desafio
          </Button>
        </TabsContent>

        {/* Aba de turmas */}
        <TabsContent
          value="classes"
          className='data-[state=active]:flex flex-col flex-1 overflow-hidden'
        >
          <ScrollArea className="flex flex-col flex-1">
            <div className="flex flex-wrap gap-4">
              {classes.map((cls, index) => {
                const isLast = index === challenges.length - 1;
                return(
                  <Card
                    key={cls.id}
                    ref={isLast ? lastItemRef : null}
                    className="
                      flex
                      w-full
                      flex-col
                      sm:w-[calc(50%-1rem)]
                      lg:w-[calc(33.333%-1rem)]
                    "
                  >
                    <CardHeader className='px-6 py-4 flex flex-row grow gap-2 space-y-0 justify-between'>
                      <div>
                        <CardTitle className='mb-2 overflow-hidden text-ellipsis'>
                          {cls.name}
                        </CardTitle>
                        <CardDescription>{cls.description}</CardDescription>
                      </div>
                      <ButtonGroup>
                        <Button
                          size='icon'
                          variant="outline"
                          className="hover:bg-secondary"
                          onClick={() => handleEditSchoolClass(cls)}
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          size='icon'
                          variant="outline"
                          className="hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteClass(cls.id)}
                        >
                          <Trash2Icon />
                        </Button>
                      </ButtonGroup>
                    </CardHeader>
                    <Separator />
                    <CardFooter className='px-6 py-2 flex justify-between'>
                      <div>
                        <Badge variant="secondary" className='mr-2 text-sm font-bold'>
                          <UserIcon className='mr-1'/>
                          {cls.count.students}
                        </Badge>
                        <Badge variant="secondary" className='text-sm font-bold'>
                          <ClipboardListIcon className='mr-1'/>
                          {cls.count.challenges}
                        </Badge>
                      </div>
                      <Button onClick={() => navigate(`/classes/${cls.id}`)} size='sm'>
                        Acessar
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>

          {isTeacher && (
            <Button onClick={handleCreateSchoolClass} className='my-4 w-full max-w-sm self-center'>
              <PlusIcon />
              Adicionar Turma
            </Button>
          )}
        </TabsContent>
      </Tabs>

      <ActionDialog
        open={open}
        onOpenChange={setOpen}
        title={config.title}
        description={config.description}
        confirmLabel={config.confirmLabel}
        variant={config.variant}
        onConfirm={handleConfirm}
      />

      <SchoolClassFormDialog
        mode={dialogSchoolClasFormMode}
        open={dialogSchoolClasFormOpen}
        onOpenChange={setDialogSchoolClasFormOpen}
        initialData={selectedClass ?? null}
        onSuccess={(response) => {
        setClasses((prev) =>
          updateSchoolClassList(prev, response, dialogSchoolClasFormMode)
        );
      }}
      />
    </div >
  );
}
