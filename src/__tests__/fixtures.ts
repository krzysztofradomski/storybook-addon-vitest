import type { JSONTestResults, AssertionResult } from "../typings";

export const makeAssertion = (
  overrides: Partial<AssertionResult> = {},
): AssertionResult => ({
  ancestorTitles: ["", "My Suite"],
  fullName: "My Suite renders correctly",
  title: "renders correctly",
  duration: 10,
  status: "passed",
  ...overrides,
});

export const sampleTestResults: JSONTestResults = {
  numTotalTestSuites: 1,
  numPassedTestSuites: 1,
  numFailedTestSuites: 0,
  numPendingTestSuites: 0,
  numTotalTests: 3,
  numPassedTests: 2,
  numFailedTests: 1,
  numPendingTests: 0,
  numTodoTests: 0,
  startTime: 1698956313163,
  success: true,
  testResults: [
    {
      assertionResults: [
        makeAssertion({
          ancestorTitles: ["", "Button unit tests"],
          title: "renders text and children",
          status: "passed",
        }),
        makeAssertion({
          ancestorTitles: ["", "Button unit tests"],
          title: "handles click action",
          status: "passed",
        }),
        makeAssertion({
          ancestorTitles: ["", "Button accessibility"],
          title: "has correct aria label",
          status: "failed",
        }),
      ],
      startTime: 1698956314807,
      endTime: 1698956314843,
      status: "passed",
      message: "",
      name: "/path/to/src/components/Button/Button.test.tsx",
    },
  ],
};
