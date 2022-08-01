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
  const [selected, setSelected] = useState(selectedOptions);
  useEffect(() => {
    setSelected(selectedOptions);
  }, [selectedOptions]);
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
      {isOpen && options.length > 0 && (
        <ul>
          {options?.map(({ label, value }: Option) => (
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
