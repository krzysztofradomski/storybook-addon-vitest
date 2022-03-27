## storybook_vitest_addon

### \_

Addon meant to display Vitest unit test results in a new Stoybook panel. Developed and tested with React.
Simply add it to the addon list in your Storybook config, and then you can use it in any story.

The addon offers minimal visuals for maximum clarity.
It needs 2 params: `results` - test results file in json format and `testFile` - name of the component test file (TypeScript definitions available).

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
       results: vitestResults,
    },
  },
};
/.../
```

![](2022-03-27-18-36-17.png)
