import React from "react";
import { useParameter } from "@storybook/api";
import { PARAM_KEY } from "./constants";
import { JSONTestResults, TestResult, VitestParams } from "./typings";

const VitestPanel = () => {
  const params = useParameter(PARAM_KEY, null) as VitestParams;
  const fileName = params?.testFile || null;
  const json: JSONTestResults = params?.results || null;

  const data = json?.testResults
    ?.filter((t: TestResult) => t.testFilePath.includes(fileName))
    .map((t) => ({
      status: t.status,
      displayName: t.displayName,
    }));

  return (
    <ul>
      {!fileName && !data ? (
        <li>
          Please check your config: missing both `testFile` and `results`.{" "}
        </li>
      ) : null}
      {!fileName && data ? (
        <li>Please check your config: missing `testFile` name.</li>
      ) : null}
      {fileName && !data ? (
        <li>Please check your config: missing `results` file.</li>
      ) : null}
      {fileName && data?.length == 0 && <li>No tests found</li>}
      {data?.map((d: { status: string; displayName: string }) => (
        <li key={d.displayName}>
          <p>
            {d.displayName}
            <span style={{ color: d.status === "pass" ? "green" : "red" }}>
              {d.status}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
};

export default VitestPanel;
