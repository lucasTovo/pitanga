import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpRightIcon, ClipboardListIcon, LogOutIcon, PencilIcon, PlusIcon, Trash2Icon, UserIcon } from 'lucide-react';

import { SchoolClass } from '@/types/school-class.types';

import { deleteSchoolClass } from '@/infra/data/school.rest';
import { orchestratorRest } from '@/infra/data/orchestrator.rest';

import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/app/hooks/useUser';
import { useChallenges } from '@/app/hooks/useChallenges';
import { useActionDialog } from '@/app/hooks/useActionDialog';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import { useSchoolClassList } from '@/app/hooks/useSchoolClassList';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from "@/components/ui/spinner"
import { ModeToggle } from '@/components/mode-toggle';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ButtonGroup } from '@/components/ui/button-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionDialog } from '@/app/components/ActionDialog';
import { DifficultyLevelBadge } from '@/app/components/DifficultyLevelBadge';
import { SchoolClassFormDialog } from '@/app/components/SchoolClassFormDialog';

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [dialogSchoolClasFormOpen, setDialogSchoolClasFormOpen] = useState(false);
  const [dialogSchoolClasFormMode, setDialogSchoolClasFormMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  const { user, isTeacher } = useUser();

  const {
    open,
    setOpen,
    config,
    showDialog,
    handleConfirm
  } = useActionDialog();

  const {
    schoolClassList,
    schoolClassListIsLoading,
  } = useSchoolClassList();

  const {
    challenges,
    challengesFetchNextPage,
    challengesHasNextPage,
    challengesIsFetchingNextPage
  } = useChallenges();

  const { lastElementRef } = useInfiniteScroll({
    hasNextPage: challengesHasNextPage,
    isFetching: challengesIsFetchingNextPage,
    onLoadMore: challengesFetchNextPage
  });

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
        queryClient.invalidateQueries({ queryKey: ['classes'] });
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
        queryClient.invalidateQueries({ queryKey: ['classes'] });
      },
    });
  }

  const handleEditChallenge = (id: string) => {
    navigate(`/challenges/${id}/edit`);
  }

  if (schoolClassListIsLoading) return <p>Carregando turmas...</p>;

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
          <TabsTrigger value="challenges">Meus desafios</TabsTrigger>
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
                      ref={isLast ? lastElementRef : null}
                      className="
                        flex
                        w-full
                        flex-col
                        sm:w-[calc(50%-1rem)]
                        lg:w-[calc(33.333%-1rem)]
                      "
                    >
                      <CardHeader
                        className='px-6 py-4 flex flex-row grow gap-2 space-y-0 justify-between'
                      >
                        <div className='w-full flex flex-col justify-between'>
                          <CardTitle className='flex justify-between items-start gap-2'>
                            <span>{ch.title}</span>
                            <DifficultyLevelBadge level={ch.level}/>
                          </CardTitle>
                          {ch.description &&
                            <CardDescription className='mt-2 max-h-10 overflow-hidden'>
                              <div
                                className='revert-all description-container multiline-ellipsis'
                                dangerouslySetInnerHTML={{ __html: ch.description }}
                              />
                            </CardDescription>
                          }
                        </div>
                      </CardHeader>
                      <Separator/>
                      <CardFooter className='px-6 py-2 flex justify-between'>
                        <ButtonGroup>
                          <Button
                            size='icon'
                            variant="outline"
                            className="hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteChallenge(ch.id)}
                          >
                            <Trash2Icon />
                          </Button>

                          <Button
                            size='icon'
                            variant="outline"
                            className="hover:bg-secondary"
                            onClick={() => handleEditChallenge(ch.id)}
                          >
                            <PencilIcon />
                          </Button>
                        </ButtonGroup>

                        <Button
                          size='sm'
                          className='font-semibold'
                          onClick={() => navigate(`/challenges/${ch.id}`)}
                        >
                          Acessar o desafio
                          <ArrowUpRightIcon />
                        </Button>
                      </CardFooter>
                    </Card>
                )
              })}

              {challengesIsFetchingNextPage && (
                <Spinner className='m-auto' />
              )}
            </div>
          </ScrollArea>

          <Button
            className='my-4 w-full max-w-sm self-center'
            onClick={() => navigate('/challenges/create')}
          >
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
              {schoolClassList?.map((cls) => {
                return(
                  <Card
                    key={cls.id}
                    className="
                      flex
                      w-full
                      flex-col
                      sm:w-[calc(50%-1rem)]
                      lg:w-[calc(33.333%-1rem)]
                    "
                  >
                    <CardHeader
                      className='px-6 py-4 flex flex-row grow gap-2 space-y-0 justify-between'
                    >
                      <div>
                        <CardTitle className='mb-2'>
                          {cls.name}
                        </CardTitle>
                        <CardDescription>{cls.description}</CardDescription>
                      </div>
                      <div className='flex flex-col sm:flex-row gap-2 items-start'>
                        <Badge variant="outline" className='text-sm font-bold text-primary border-2 border-primary'>
                          <UserIcon className='mr-1' />
                          {cls.count.students}
                        </Badge>
                        <Badge variant="outline" className='text-sm font-bold text-primary border-2 border-primary'>
                          <ClipboardListIcon className='mr-1'/>
                          {cls.count.challenges}
                        </Badge>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardFooter className='px-6 py-2 flex justify-between'>
                      <ButtonGroup>
                        <Button
                          size='icon'
                          variant="outline"
                          className="hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteClass(cls.id)}
                        >
                          <Trash2Icon />
                        </Button>
                        <Button
                          size='icon'
                          variant="outline"
                          className="hover:bg-secondary"
                          onClick={() => handleEditSchoolClass(cls)}
                        >
                          <PencilIcon />
                        </Button>
                      </ButtonGroup>
                      <Button
                        size='sm'
                        className='font-semibold'
                        onClick={() => navigate(`/classes/${cls.id}`)}
                      >
                        Acessar turma
                        <ArrowUpRightIcon />
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>

          {isTeacher && (
            <Button
              onClick={handleCreateSchoolClass}
              className='my-4 w-full max-w-sm self-center'
            >
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
      />
    </div >
  );
}
