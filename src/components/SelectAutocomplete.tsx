import { FC, useRef, useEffect, useState } from "react";
import type { Option } from "../types/options";
import styles from "./SelectAutocomplete.module.css";

export interface SelectAutocompleteProps {
  label: string;
  multi?: boolean;
  name: string;
  options: Option[];
  selectedOptions?: string[];
}

const SelectAutocomplete: FC<SelectAutocompleteProps> = ({
  label,
  multi = false,
  name,
  options,
  selectedOptions = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(selectedOptions);

  useEffect(() => {
    setSelected(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (containerRef.current) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  useEffect(() => {
    const regExp = new RegExp(search, "i");
    setFilteredOptions(
      options.filter((option) => search === "" || option.label.match(regExp))
    );
  }, [search]);

  useEffect(() => {
    if (!isOpen && search !== "") setSearch("");
  }, [isOpen]);

  const selectOption = (value: string) => {
    let updatedSelection;
    if (selected.includes(value)) {
      updatedSelection = selected.filter((li) => li !== value);
    } else {
      updatedSelection = multi ? [...selected, value] : [value];
    }
    setSelected(updatedSelection);
  };

  return (
    <div ref={containerRef}>
      {
        <label>
          {label}
          <select
            className={styles.hidden}
            name={name}
            {...(multi ? { multiple: true } : {})}
            value={multi ? selected : selected[0]}
          >
            {options?.map(({ label, value }: Option) => (
              <option key={`option-${value}`} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      }
      <input
        type="text"
        name={`filter-${name}`}
        onFocus={() => {
          if (!isOpen) setIsOpen(true);
        }}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <img alt={`${isOpen ? "Masquer" : "Afficher"} les options`} />
      </button>
      {isOpen && filteredOptions.length > 0 && (
        <ul>
          {filteredOptions?.map(({ label, value }: Option) => (
            <li
              data-value={value}
              data-selected={selected.includes(value)}
              className={
                selected.includes(value) ? styles["option-selected"] : ""
              }
              key={`option-display-${value}`}
              onClick={() => {
                selectOption(value);
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectAutocomplete;
