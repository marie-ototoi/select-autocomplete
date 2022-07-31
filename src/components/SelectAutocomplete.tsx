import { FC, useRef, useEffect, useState } from "react";
import type { Option } from "../types/options";

export interface SelectAutocompleteProps {
  label: string;
  options: Option[];
}

const SelectAutocomplete: FC<SelectAutocompleteProps> = ({
  label,
  options,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
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
      {isOpen &&
        options?.map(({ label, value }: Option) => (
          <li data-value={value}>{label}</li>
        ))}
    </div>
  );
};

export default SelectAutocomplete;
