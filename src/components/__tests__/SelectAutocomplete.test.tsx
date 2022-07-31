import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SelectAutocomplete from "../SelectAutocomplete";

describe("SelectAutocomplete", () => {
  it("should render default text field with label", () => {
    render(<SelectAutocomplete label="Pays" options={[]} />);
    expect(screen.getByLabelText("Pays")).toBeInTheDocument();
  });

  it("should render default options", () => {
    render(
      <SelectAutocomplete
        label="Pays"
        options={[
          { label: "France", value: "fr" },
          { label: "Italie", value: "it" },
        ]}
      />
    );
    expect(screen.getByLabelText("Pays")).toBeInTheDocument();
  });
  describe("Options", () => {
    it("should not display options at first display", () => {
      render(
        <SelectAutocomplete
          label="Pays"
          options={[
            { label: "France", value: "fr" },
            { label: "Italie", value: "it" },
          ]}
        />
      );
      expect(screen.queryByText("France")).not.toBeInTheDocument();
      expect(screen.queryByText("Italie")).not.toBeInTheDocument();
    });
  });
});
