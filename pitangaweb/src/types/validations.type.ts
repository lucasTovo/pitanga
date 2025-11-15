export interface ValidationId {
  id: number;
  challengeId: string;
}

export interface ValidationBase {
  id: ValidationId;
  testInput: string;
  expectedOutput: string;
}

export enum ValidationStatus {
  PASS = "PASS",
  FAIL = "FAIL"
}

export interface ValidationResult extends Omit<ValidationBase, 'testInput'> {
  input: string;
  output: string;
  status: ValidationStatus | null;
}
