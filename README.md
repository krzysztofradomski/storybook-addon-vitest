## storybook_vitest_addon

###

[![Release](https://github.com/krzysztofradomski/storybook-addon-vitest/actions/workflows/release.yml/badge.svg)](https://github.com/krzysztofradomski/storybook-addon-vitest/actions/workflows/release.yml)

Installation:

```
yarn add storybook_vitest_addon
```

Compatibility:

```
"storybook": "^7.6.6",
"@storybook/react": "^7.6.6",
"vite": "^5.0.10",
"vitest": "^1.1.0"
```

Description:

Addon meant to display Vitest unit test results in a new Stoybook panel. Developed and tested with React.
Simply add it to the addon list in your Storybook config, and then you can use it in any story.

The addon offers minimal visuals for maximum clarity.
It needs 2 params: `testResults` - test results file in json format and `testFile` - name of the component test file (TypeScript definitions available).

Example usage:

```

// Button.stories.tsx

import vitestResults from "./unit-test-results.json";
/.../
export default {
  title: "Example/Button",
  component: Button,
  parameters: {
    vitest: {
      testFile: "Button.test.tsx",
      testResults: vitestResults,
    },
  },
};
/.../

```

![](2022-04-01-22-48-00.png)

Also see https://storybook.js.org/addons/storybook_vitest_addon
