import { Challenge } from "@/types/challenges.types";
import { ValidationResult } from "./validations.type";

export enum SolutionStatus {
  SOLVED = "SOLVED",
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
}

export interface SolutionId {
  hash: string;
  challengeId: string;
  submitterId: number;
}

export interface Solution {
  code: string;
  solutionId: SolutionId;
  challenge: Challenge;
  validationResults: ValidationResult[];
}