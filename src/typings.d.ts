declare module "global";

export type VitestParams = {
  testFile: string;
  results: JSONTestResults;
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
  perfStats: {
    runtime: number;
    start: number;
    end: number;
  };
  displayName: string;
  skipped: boolean;
  status: string;
  testFilePath: string;
};
