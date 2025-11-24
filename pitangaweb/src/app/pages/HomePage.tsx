import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LogOutIcon, PlusIcon, UserIcon } from 'lucide-react';

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
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionDialog } from '@/app/components/ActionDialog';
import { PageContainer } from '@/app/components/PageContainer';
import { ChallengeCard } from '@/app/components/ChallengeCard';
import { SchoolClassCard } from '@/app/components/SchoolClassCard';
import { SchoolClassFormDialog } from '@/app/components/SchoolClassFormDialog';

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [dialogSchoolClasFormOpen, setDialogSchoolClasFormOpen] = useState(false);
  const [dialogSchoolClasFormMode, setDialogSchoolClasFormMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    <PageContainer lockScroll className='space-y-6 flex flex-col'>
      <Card className="w-full">
        <CardHeader className='relative flex-row space-y-0 p-3 sm:p-5 pt-8 pb-6'>
          <div className='flex items-center'>
            <Avatar className="w-14 h-14 object-cover mr-3">
              {/* <AvatarImage className='rounded-full' src="https://github.com/shadcn.png" alt="@shadcn" /> */}
              <AvatarFallback className='bg-muted'>
                <UserIcon className='rounded-full'/>
              </AvatarFallback>
            </Avatar>

            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-2">
                  <UserIcon className="w-4 h-4" />
                  {isTeacher ? 'Professor' : 'Aluno'}
                </Badge>
              </CardDescription>
            </div>
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <ThemeToggle />
            <Button
              variant="destructive"
              onClick={() => logout()}
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
          <TabsTrigger value="classes">Minhas turmas</TabsTrigger>
        </TabsList>

        {/* Aba de desafios */}
        <TabsContent
          value="challenges"
          className='data-[state=active]:flex flex-col flex-1 overflow-hidden'
        >
          <ScrollArea className="flex flex-1" >
            <div className="pr-3 flex flex-wrap gap-4">
              {challenges.map((ch, index) => {
                const isLast = index === challenges.length - 1;
                return(
                  <ChallengeCard
                    key={ch.id}
                    challenge={ch}
                    onDelete={handleDeleteChallenge}
                    onEdit={handleEditChallenge}
                    onAction={(id) => navigate(`/challenges/${id}`)}
                    ref={isLast ? lastElementRef : undefined}
                  />
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
          <ScrollArea className="flex flex-1">
            <div className="pr-3 flex flex-wrap gap-4">
              {schoolClassList?.map((cls) => {
                return(
                  <SchoolClassCard
                    key={cls.id}
                    schoolClass={cls}
                    {...(isTeacher && {
                      onDelete: handleDeleteClass,
                      onEdit: handleEditSchoolClass,
                    })}
                    onOpen={(id) => navigate(`/classes/${id}`)}
                  />
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
    </PageContainer>
  );
}
