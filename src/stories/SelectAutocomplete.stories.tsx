import React from "react";
import { ComponentMeta, Story } from "@storybook/react";

import { SelectAutocomplete, SelectAutocompleteProps } from "../";

export default {
  component: SelectAutocomplete,
  argTypes: {
    backgroundColor: {
      control: { type: "text" },
    },
    cover: {
      control: { type: "text" },
    },
    fillColor: {
      control: { type: "text" },
    },
    side: {
      control: { type: "number" },
    },
    textColor: {
      control: { type: "text" },
    },
  },
} as ComponentMeta<typeof SelectAutocomplete>;

const Template: Story<SelectAutocompleteProps> = (args): any => {
  return <SelectAutocomplete {...args} />;
};

const Default = Template.bind({});

Default.args = {
  label: "Département",
};

export { Default };
