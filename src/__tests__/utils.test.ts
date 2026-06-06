import { describe, it, expect } from "vitest";
import { reduceFileTestResults, extractFileTestsData } from "../Panel";
import type { GroupedTestResults } from "../typings";
import { makeAssertion, sampleTestResults } from "./fixtures";

describe("reduceFileTestResults", () => {
  it("creates a new group for an unseen ancestorTitle", () => {
    const result = reduceFileTestResults({}, makeAssertion());
    expect(result).toEqual({
      "My Suite": [{ title: "renders correctly", status: "passed" }],
    });
  });

  it("appends to an existing group for the same ancestorTitle", () => {
    const initial: GroupedTestResults = {
      "My Suite": [{ title: "renders correctly", status: "passed" }],
    };
    const result = reduceFileTestResults(
      initial,
      makeAssertion({ title: "handles click", status: "failed" }),
    );
    expect(result["My Suite"]).toHaveLength(2);
    expect(result["My Suite"][1]).toEqual({
      title: "handles click",
      status: "failed",
    });
  });

  it("handles multiple distinct groups without mixing entries", () => {
    const assertions = [
      makeAssertion({ ancestorTitles: ["", "Group A"], title: "test 1" }),
      makeAssertion({ ancestorTitles: ["", "Group B"], title: "test 2" }),
      makeAssertion({ ancestorTitles: ["", "Group A"], title: "test 3" }),
    ];

    const result = assertions.reduce(reduceFileTestResults, {});

    expect(Object.keys(result)).toEqual(["Group A", "Group B"]);
    expect(result["Group A"]).toHaveLength(2);
    expect(result["Group B"]).toHaveLength(1);
  });

  it("preserves the status value from each assertion", () => {
    const result = reduceFileTestResults(
      {},
      makeAssertion({ status: "failed" }),
    );
    expect(result["My Suite"][0].status).toBe("failed");
  });

  it("only stores title and status, discarding other assertion fields", () => {
    const result = reduceFileTestResults({}, makeAssertion());
    const entry = result["My Suite"][0];
    expect(Object.keys(entry)).toEqual(["title", "status"]);
  });

  it("uses the second element of ancestorTitles as the group key", () => {
    const assertion = makeAssertion({
      ancestorTitles: ["ignored-parent", "actual-group"],
    });
    const result = reduceFileTestResults({}, assertion);
    expect(result["actual-group"]).toBeDefined();
    expect(result["ignored-parent"]).toBeUndefined();
  });
});

describe("extractFileTestsData", () => {
  it("returns an empty object when no file matches", () => {
    const result = extractFileTestsData(sampleTestResults, "NonExistent.test.tsx");
    expect(result).toEqual({});
  });

  it("returns grouped results when the file name matches exactly", () => {
    const result = extractFileTestsData(
      sampleTestResults,
      "Button.test.tsx",
    );
    expect(result).toHaveProperty("Button unit tests");
    expect(result["Button unit tests"]).toHaveLength(2);
  });

  it("matches by partial file name using includes", () => {
    const result = extractFileTestsData(sampleTestResults, "Button");
    expect(result).toHaveProperty("Button unit tests");
  });

  it("groups assertion results under their respective suite names", () => {
    const result = extractFileTestsData(sampleTestResults, "Button.test.tsx");
    expect(Object.keys(result)).toContain("Button unit tests");
    expect(Object.keys(result)).toContain("Button accessibility");
  });

  it("returns an empty object when testResults array is empty", () => {
    const emptyResults = { ...sampleTestResults, testResults: [] };
    const result = extractFileTestsData(emptyResults, "Button.test.tsx");
    expect(result).toEqual({});
  });

  it("handles testResults being undefined gracefully", () => {
    const malformed = {} as typeof sampleTestResults;
    const result = extractFileTestsData(malformed, "Button.test.tsx");
    expect(result).toEqual({});
  });

  it("returns full grouped structure for all assertion entries in the file", () => {
    const result = extractFileTestsData(sampleTestResults, "Button.test.tsx");
    const passedGroup = result["Button unit tests"];
    expect(passedGroup.map((r) => r.title)).toEqual([
      "renders text and children",
      "handles click action",
    ]);
  });
});
