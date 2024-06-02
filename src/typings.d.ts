declare module "global";

export type VitestParams = {
  testFile: string;
  testResults: JSONTestResults;
};

export type JSONTestResults = {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numPendingTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numPendingTests: number;
  numTodoTests: number;
  startTime: number;
  success: boolean;
  testResults: TestResult[];
};

export type TestResult = {
  assertionResults: Array<AssertionResult>;
  startTime: number;
  endTime: number;
  status: string;
  message: string;
  name: string;
};

export type AssertionResult = {
  ancestorTitles: [string, string];
  fullName: string;
  title: string;
  duration: number;
  status: string;
};

export type Result = {
  title: string;
  status: string;
};

export type GroupResult = Array<Result>;

export type GroupedTestResults = {
  [key: string]: GroupResult;
};
