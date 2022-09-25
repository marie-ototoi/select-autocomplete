import { FC, KeyboardEvent, useRef, useEffect, useState } from "react";
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
  const listRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(selectedOptions);
  const [hovered, setHovered] = useState<number | null>(null);

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
    const regExp = new RegExp(search.trim(), "i");
    setFilteredOptions(
      options.filter((option) => search === "" || option.label.match(regExp))
    );
  }, [search]);

  useEffect(() => {
    if (!isOpen && search !== "") setSearch("");
    if (isOpen) {
      listRef.current?.focus();
    }
  }, [isOpen]);

  const selectOption = (value: string) => {
    let updatedSelection;
    if (selected.includes(value)) {
      updatedSelection = selected.filter((li) => li !== value);
    } else {
      if (multi) {
        updatedSelection = [...selected, value];
      } else {
        updatedSelection = [value];
        setIsOpen(false);
        setHovered(null);
      }
    }
    setSelected(updatedSelection);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ArrowUp":
        if (hovered === null) {
          setHovered(filteredOptions.length - 1);
        } else if (hovered <= 0) {
          setHovered(null);
        } else {
          setHovered(hovered - 1);
        }
        if (!isOpen) setIsOpen(true);
        listRef.current?.focus();
        break;
      case "ArrowDown":
        if (hovered === null) {
          setHovered(0);
        } else if (hovered >= filteredOptions.length - 1) {
          setHovered(null);
        } else {
          setHovered(hovered + 1);
        }
        if (!isOpen) setIsOpen(true);
        listRef.current?.focus();
        break;
      case "Space":
        if (!isOpen) setIsOpen(true);
        listRef.current?.focus();
        break;
      case "Enter":
        if (isOpen && hovered !== null) {
          selectOption(filteredOptions[hovered].value);
        }
        break;
      case "Escape":
        setHovered(null);
        setIsOpen(false);
        break;
      default:
        //
        break;
    }
  };
  return (
    <div lang="fr" ref={containerRef} onKeyDown={handleKeyDown}>
      {
        <label lang="fr">
          {label}
          <input
            {...(hovered !== null
              ? {
                  "aria-activedescendant": `option-display-${filteredOptions[hovered]?.value}`,
                }
              : {})}
            aria-autocomplete="list"
            aria-controls="list-id"
            aria-describedby={`help-${name}`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            name={`filter-${name}`}
            onFocus={() => {
              if (!isOpen) setIsOpen(true);
            }}
            onChange={(e) => {
              if (!isOpen) setIsOpen(true);
              setSearch(e.target.value);
            }}
            role="combobox"
            type="text"
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
      <div
        aria-live="polite"
        aria-relevant="text"
        className={styles["visually-hidden"]}
        id={`help-${name}`}
      >
        {isOpen
          ? filteredOptions.length + " results"
          : "type text to filter options"}
      </div>
      <select
        className={styles.hidden}
        data-testid="select"
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
      {isOpen && filteredOptions.length > 0 && (
        <ul data-testid="list" id="list-id" role="listbox" ref={listRef}>
          {filteredOptions?.map(({ label, value }: Option, index: number) => (
            <li
              aria-selected={hovered === index ? "true" : "false"}
              aria-posinset={index + 1}
              aria-setsize={filteredOptions.length}
              className={`${
                selected.includes(value) ? styles["option-selected"] : ""
              } ${hovered === index ? styles["option-hovered"] : ""}`}
              data-value={value}
              data-selected={selected.includes(value)}
              id={`option-display-${value}`}
              key={`option-display-${value}`}
              onClick={() => {
                selectOption(value);
              }}
              onMouseEnter={() => setHovered(index)}
              role="option"
              tabIndex={-1}
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
