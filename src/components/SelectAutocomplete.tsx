import { FC, useRef, useState } from "react";
import type { Option } from "../types/options";

export interface SelectAutocompleteProps {
  label: string;
  options: Option[];
}

const SelectAutocomplete: FC<SelectAutocompleteProps> = ({
  label,
  options,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div ref={ref}>
      {
        <label>
          {label}
          <input
            type="text"
            onFocus={() => {
              if (!isOpen) setIsOpen(true);
            }}
          />
        </label>
      }
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <img alt={`${isOpen ? "Masquer" : "Afficher"} les options`} />
      </button>
      {isOpen &&
        options?.map(({ label, value }: Option) => (
          <li data-value={value}>{label}</li>
        ))}
    </div>
  );
};

export default SelectAutocomplete;
