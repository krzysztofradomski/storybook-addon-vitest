import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import VitestPanel from "../Panel";
import { sampleTestResults } from "./fixtures";

vi.mock("storybook/manager-api", () => ({
  useParameter: vi.fn(),
}));

vi.mock("../constants", () => ({
  PARAM_KEY: "vitest",
}));

import { useParameter } from "storybook/manager-api";
const mockUseParameter = vi.mocked(useParameter);

describe("VitestPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when useParameter returns a falsy value", () => {
    it("renders nothing when params are null", () => {
      mockUseParameter.mockReturnValue(null);
      const { container } = render(<VitestPanel />);
      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when params are undefined", () => {
      mockUseParameter.mockReturnValue(undefined);
      const { container } = render(<VitestPanel />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("error states", () => {
    it("shows error when both testFile and testResults are missing", () => {
      mockUseParameter.mockReturnValue({});
      render(<VitestPanel />);
      expect(
        screen.getByText(/missing both `testFile` and `testResults`/),
      ).toBeInTheDocument();
    });

    it("shows error when testFile is missing but testResults is present", () => {
      mockUseParameter.mockReturnValue({ testResults: sampleTestResults });
      render(<VitestPanel />);
      expect(
        screen.getByText(/missing `testFile` name/),
      ).toBeInTheDocument();
    });

    it("shows error when testResults is missing but testFile is present", () => {
      mockUseParameter.mockReturnValue({ testFile: "Button.test.tsx" });
      render(<VitestPanel />);
      expect(
        screen.getByText(/missing `testResults` file/),
      ).toBeInTheDocument();
    });

    it("shows error when testResults object lacks the testResults property", () => {
      mockUseParameter.mockReturnValue({
        testFile: "Button.test.tsx",
        testResults: { success: true },
      });
      render(<VitestPanel />);
      expect(
        screen.getByText(/does not contain valid results format/),
      ).toBeInTheDocument();
    });

    it("shows 'No tests found' when testFile does not match any result", () => {
      mockUseParameter.mockReturnValue({
        testFile: "NonExistent.test.tsx",
        testResults: sampleTestResults,
      });
      render(<VitestPanel />);
      expect(screen.getByText(/No tests found/)).toBeInTheDocument();
    });
  });

  describe("successful rendering", () => {
    beforeEach(() => {
      mockUseParameter.mockReturnValue({
        testFile: "Button.test.tsx",
        testResults: sampleTestResults,
      });
    });

    it("renders no error message", () => {
      render(<VitestPanel />);
      expect(screen.queryByText(/Please check your config/)).toBeNull();
      expect(screen.queryByText(/No tests found/)).toBeNull();
    });

    it("renders each test group as a bold heading", () => {
      render(<VitestPanel />);
      const headings = screen.getAllByText(/Button unit tests|Button accessibility/);
      headings.forEach((el) => expect(el.tagName).toBe("STRONG"));
    });

    it("renders all test titles", () => {
      render(<VitestPanel />);
      expect(screen.getByText("renders text and children")).toBeInTheDocument();
      expect(screen.getByText("handles click action")).toBeInTheDocument();
      expect(screen.getByText("has correct aria label")).toBeInTheDocument();
    });

    it("shows ✔️ for passed tests", () => {
      render(<VitestPanel />);
      const passIcons = screen.getAllByText("✔️");
      expect(passIcons).toHaveLength(2);
    });

    it("shows ❌ for failed tests", () => {
      render(<VitestPanel />);
      const failIcons = screen.getAllByText("❌");
      expect(failIcons).toHaveLength(1);
    });

    it("renders the correct number of test groups", () => {
      render(<VitestPanel />);
      expect(screen.getByText("Button unit tests")).toBeInTheDocument();
      expect(screen.getByText("Button accessibility")).toBeInTheDocument();
    });
  });

  describe("layout and container", () => {
    it("wraps content in a padded div", () => {
      mockUseParameter.mockReturnValue({ testFile: "Button.test.tsx", testResults: sampleTestResults });
      const { container } = render(<VitestPanel />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.tagName).toBe("DIV");
      expect(wrapper.style.padding).toBe("1rem");
    });
  });
});
