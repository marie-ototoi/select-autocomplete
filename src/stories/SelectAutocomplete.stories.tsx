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
    { label: "Belgique", value: "be" },
    { label: "Brésil", value: "br" },
    { label: "Canada", value: "ca" },
    { label: "Chili", value: "cl" },
    { label: "Allemagne", value: "de" },
    { label: "Danemark", value: "dk" },
    { label: "Espagne", value: "es" },
    { label: "Finlande", value: "fi" },
    { label: "France", value: "fr" },
    { label: "Grèce", value: "gr" },
    { label: "Hongrie", value: "hu" },
    { label: "Inde", value: "in" },
    { label: "Italie", value: "it" },
    { label: "Japon", value: "jp" },
    { label: "Mexique", value: "mx" },
    { label: "Norvège", value: "no" },
    { label: "Pays-bas", value: "nl" },
    { label: "Pologne", value: "pl" },
    { label: "Royaume-Uni", value: "uk" },
    { label: "Suède", value: "sv" },
  ],
  selectedOptions: ["fr"],
};

const Multi = Template.bind({});

Multi.args = { ...Default.args, multi: true };

export { Default, Multi };
