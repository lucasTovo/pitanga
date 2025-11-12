export interface ValidationId {
  id: number;
  challengeId: string;
}

export interface ValidationBase {
  id: ValidationId;
  challengeId: string;
  testInput: string;
  expectedOutput: string;
}

export enum ValidationStatus {
  PASS = "PASS",
  FAIL = "FAIL"
}

export interface ValidationResult extends ValidationBase {
  output: string;
  status: ValidationStatus | null;
}