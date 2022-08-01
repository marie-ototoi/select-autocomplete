import React from "react";
import { ComponentMeta, Story } from "@storybook/react";

import { SelectAutocomplete, SelectAutocompleteProps } from "../";

export default {
  component: SelectAutocomplete,
  argTypes: {
    label: {
      control: { type: "text" },
    },
    options: {
      control: { type: "array" },
    },
  },
} as ComponentMeta<typeof SelectAutocomplete>;

const Template: Story<SelectAutocompleteProps> = (args) => {
  return <SelectAutocomplete {...args} />;
};

const Default = Template.bind({});

Default.args = {
  label: "Pays",
  options: [
    { label: "France", value: "fr" },
    { label: "Italie", value: "it" },
  ],
  selectedOptions: ["fr"],
};

export { Default };
