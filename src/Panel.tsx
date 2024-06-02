import React from "react";
import {
  GroupedTestResults,
  GroupResult,
  AssertionResult,
  VitestParams,
} from "./typings";
import { PARAM_KEY } from "./constants";
import { useParameter } from "@storybook/manager-api";

function reduceFileTestResults(
  accumulator: GroupedTestResults,
  assertionResult: AssertionResult,
): GroupedTestResults {
  const [, testGroupName] = assertionResult.ancestorTitles;
  if (!accumulator[testGroupName]) {
    accumulator[testGroupName] = [];
  }
  accumulator[testGroupName].push({
    title: assertionResult.title,
    status: assertionResult.status,
  });

  return accumulator;
}

function extractFileTestsData(
  results: VitestParams["testResults"],
  fileName: string,
): GroupedTestResults {
  const fileTestResults = results.testResults?.find((r) =>
    r.name.includes(fileName),
  );
  if (!fileTestResults) {
    return {};
  }

  return fileTestResults.assertionResults.reduce(
    reduceFileTestResults,
    {} as GroupedTestResults,
  );
}

const VitestPanel = () => {
  const params = useParameter(PARAM_KEY) as Partial<VitestParams> | null;
  if (!params) {
    return null;
  }

  const { testResults, testFile: fileName } = params;
  let fileTestResults: GroupedTestResults | null = null;
  if (testResults && fileName) {
    fileTestResults = extractFileTestsData(testResults, fileName);
  }

  let error: string | null = null;
  if (!fileName && !testResults) {
    error =
      'Please check your config: missing both `testFile` and `testResults`.{" "}';
  } else if (!fileName) {
    error = "Please check your config: missing `testFile` name.";
  } else if (!testResults) {
    error = "Please check your config: missing `testResults` file.";
  } else if ("testResults"! in testResults) {
    error =
      "Please check your config: `testResults` file does not contain valid results format.";
  } else if (Object.keys(fileTestResults).length === 0) {
    error = "No tests found.";
  }

  return (
    <div style={{ padding: "1rem" }}>
      {error && <p> {error}</p>}

      {fileTestResults &&
        Object.entries(fileTestResults).map(
          ([title, group]: [string, GroupResult]) => (
            <div key={title}>
              <strong>{title}</strong>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 8,
                  paddingTop: 8,
                  paddingBottom: 16,
                }}
              >
                {group.map((d) => (
                  <div
                    key={d.title}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 4,
                      paddingLeft: 16,
                    }}
                  >
                    <div>{d.status === "passed" ? "✔️" : "❌"}</div>
                    <div>{d.title}</div>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
    </div>
  );
};

export default VitestPanel;
