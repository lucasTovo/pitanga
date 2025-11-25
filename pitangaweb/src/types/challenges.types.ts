import { SolutionStatus } from "./solutions.types";
import { ValidationBase } from "./validations.type";

export enum ChallengeLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  PRO = "PRO",
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  baseCode: string;
  level: ChallengeLevel;
  validations: ValidationBase[];
  status: SolutionStatus;
  isPublic: boolean;
  originChallengeId?: string;
}

export interface ChallengeDTO {
  title: string;
  description: string;
  baseCode: string;
  validations: { input: string; output: string; }[];
}
