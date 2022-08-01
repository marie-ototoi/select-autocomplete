import { FC, useRef, useEffect, useState } from "react";
import type { Option } from "../types/options";
import styles from "./SelectAutocomplete.module.css";

export interface SelectAutocompleteProps {
  label: string;
  options: Option[];
  selectedOptions?: string[];
}

const SelectAutocomplete: FC<SelectAutocompleteProps> = ({
  label,
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

  return (
    <div ref={containerRef}>
      {
        <label>
          {label}
          <input
            type="text"
            onFocus={() => {
              if (!isOpen) setIsOpen(true);
            }}
            onChange={(e) => {
              setSearch(e.target.value);
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
      {isOpen && filteredOptions.length > 0 && (
        <ul>
          {filteredOptions?.map(({ label, value }: Option) => (
            <li
              data-value={value}
              data-selected={selected.includes(value)}
              className={
                selected.includes(value) ? styles["option-selected"] : ""
              }
              key={`option-${value}`}
              onClick={() => {
                setSelected(
                  selected.includes(value)
                    ? selected.filter((li) => li !== value)
                    : [...selected, value]
                );
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
