const challengesApiBase = import.meta.env.CHALLENGES_API_BASE_URL;
const classesApiBase = import.meta.env.CLASSES_API_BASE_URL;

export const restConfig = {
  challengesBaseURL: challengesApiBase && challengesApiBase.trim() !== '' ? challengesApiBase : 'https://localhost:8443',
  classesBaseURL: classesApiBase && classesApiBase.trim() !== '' ? classesApiBase : 'https://localhost:4000'
};
