import { useParams } from 'react-router-dom';

import { useUser } from '@/app/hooks/useUser';

import { PageContainer } from '@/app/components/PageContainer';
import { TeacherView } from './TeacherView';
import { StudentView } from './StudentView';

export const SchoolClassPage = () => {
  const { classId } = useParams();
  const { isTeacher } = useUser();

  if (!classId) return <p>Turma não encontrada</p>;

  return (
    <PageContainer lockScroll className='space-y-4 flex flex-col'>
      {isTeacher ? (
        <TeacherView classId={classId} />
      ) : (
        <StudentView classId={classId} />
      )}
    </PageContainer>
  );
}
