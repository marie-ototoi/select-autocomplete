import React, { FC } from "react";

export interface SelectAutocompleteProps {
  multi?: boolean;
  label?: string;
}

const SelectAutocomplete: FC<SelectAutocompleteProps> = ({ label }) => {
  return (
    <>
      <label>
        {label}
        <input type="text" />
      </label>
    </>
  );
};

export default SelectAutocomplete;
