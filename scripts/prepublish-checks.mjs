#!/usr/bin/env zx

const packageJson = require("../package.json");

const name = packageJson.name;
const displayName = packageJson.storybook.displayName;

let exitCode = 0;
$.verbose = false;

/**
 * Check that meta data has been updated
 */
if (name.includes("addon-kit") || displayName.includes("Addon Kit")) {
  console.error(
    "Missing metadata. Your package name and/or displayName includes default values from the Addon Kit. The addon gallery filters out all such addons. Please configure appropriate metadata before publishing your addon. For more info, see:https://storybook.js.org/docs/react/addons/addon-catalog#addon-metadata"
  );

  exitCode = 1;
}

/**
 * Check that README has been updated
 */
const readmeTestStrings =
  "# Storybook Addon Kit|Click the \\*\\*Use this template\\*\\* button to get started.|https://user-images.githubusercontent.com/42671/106809879-35b32000-663a-11eb-9cdc-89f178b5273f.gif";

if ((await $`cat README.md | grep -E ${readmeTestStrings}`.exitCode) == 0) {
  console.error(
    "README not updated. You are using the default README.md file that comes with the addon kit. Please update it to provide info on what your addon does and how to use it."
  );

  exitCode = 1;
}

process.exit(exitCode);
