import { deleteChallenge } from './challenges.rest';
import { removeChallengeFromAllClasses } from "./school.rest";

export const orchestratorRest = {
  async deleteChallengeCascade(challengeId: string) {
    try {
      await removeChallengeFromAllClasses(challengeId)
      await deleteChallenge(challengeId);
    } catch (error) {
      console.error(`Error deleting challenge ${challengeId} from classes:`, error);
      return null;
    }
  },
};
