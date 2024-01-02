import React from "react";
import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";

import { ADDON_ID, PANEL_ID } from "../constants";
import Panel from "../Panel";

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Tests results",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active }) => (
      <AddonPanel active={active}>
        <Panel />
      </AddonPanel>
    ),
  });
});
