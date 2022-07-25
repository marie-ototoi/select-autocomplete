import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SelectAutocomplete from "../SelectAutocomplete";

describe("SelectAutocomplete", () => {
  describe("default text field", () => {
    it("should render default text field with label", () => {
      render(<SelectAutocomplete label="Pays" />);
      expect(screen.getByLabelText("Pays")).toBeInTheDocument();
    });
  });
});
