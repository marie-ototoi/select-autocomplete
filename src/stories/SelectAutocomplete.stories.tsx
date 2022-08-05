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
  name: "country",
  options: [
    { label: "France", value: "fr" },
    { label: "Italie", value: "it" },
    { label: "Espagne", value: "es" },
    { label: "Danemark", value: "dk" },
    { label: "Suède", value: "sv" },
  ],
  selectedOptions: ["fr"],
};

const Multi = Template.bind({});

Multi.args = { ...Default.args, multi: true };

export { Default, Multi };
