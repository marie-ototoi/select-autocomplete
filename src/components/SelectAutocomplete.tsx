import React, { FC, PropsWithChildren, ReactNode, useRef } from "react";
import type { Option } from "../types/options";
export interface SelectAutocomplete {
  multi?: boolean;
}

export interface SelectDefaultAutocomplete extends SelectAutocomplete {
  label: string;
  options: Option[];
}

const SelectAutocomplete: FC<PropsWithChildren<SelectDefaultAutocomplete>> = ({
  label,
  options,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}>
      {
        <label>
          {label}
          <input type="text" />
        </label>
      }
      {options?.map(({ label, value }: Option) => (
        <li data-value={value}>{label}</li>
      ))}
    </div>
  );
};

export default SelectAutocomplete;
