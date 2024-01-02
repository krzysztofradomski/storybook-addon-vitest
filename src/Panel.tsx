import React from "react";
import { useParameter } from "@storybook/manager-api";
import { PARAM_KEY } from "./constants";
import {
  Accumulator,
  AssertionResult,
  JSONTestResults,
  ResultGroup,
  VitestParams,
} from "./typings";

const VitestPanel = () => {
  const params = useParameter(PARAM_KEY, null) as VitestParams;
  const fileName = params?.testFile || null;
  const json: JSONTestResults = params?.testResults || null;

  if (!params) return null;

  const data: { [s: string]: any } =
    json?.testResults
      .find((r) => r?.name?.includes(fileName))
      ?.assertionResults.reduce((acc, curr) => {
        const [, key] = curr.ancestorTitles;
        acc[key] = (acc[key] || []) as ResultGroup;
        const group = acc[key];
        group.push({ title: curr.title, status: curr.status });
        return acc;
      }, {} as Accumulator) || [];

  return (
    <div style={{ padding: "1rem" }}>
      {!fileName && !data ? (
        <p>
          Please check your config: missing both `testFile` and `testResults`.{" "}
        </p>
      ) : null}
      {!fileName && data ? (
        <p>Please check your config: missing `testFile` name.</p>
      ) : null}
      {fileName && !data ? (
        <p>Please check your config: missing `testResults` file.</p>
      ) : null}
      {fileName && Object.values(data)?.length == 0 && <p>No tests found</p>}
      {Object.entries(data)?.map(([title, group]) => (
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
            {(group as AssertionResult[]).map((d) => (
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
      ))}
    </div>
  );
};

export default VitestPanel;
