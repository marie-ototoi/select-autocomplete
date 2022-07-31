import React from "react";
import { render, screen } from "@testing-library/react";
import SelectAutocomplete from "../SelectAutocomplete";
import userEvent from "@testing-library/user-event";

describe("SelectAutocomplete", () => {
  const props = {
    label: "Pays",
    options: [
      { label: "France", value: "fr" },
      { label: "Italie", value: "it" },
    ],
  };

  it("should render default text field with label", () => {
    render(<SelectAutocomplete {...props} />);
    expect(screen.getByLabelText("Pays")).toBeInTheDocument();
  });

  it("should render default options", () => {
    render(<SelectAutocomplete {...props} />);
    expect(screen.getByLabelText("Pays")).toBeInTheDocument();
  });
  describe("display options", () => {
    it("should not display options at first display", () => {
      render(<SelectAutocomplete {...props} />);
      expect(screen.queryByText("France")).not.toBeInTheDocument();
      expect(screen.queryByText("Italie")).not.toBeInTheDocument();
    });
    it("should open and display all options when the user focuses on the field", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("textbox"));
      expect(await screen.findAllByRole("listitem")).toHaveLength(
        props.options.length
      );
    });
    it("should close and hide all options when the user triggers the close arrow button", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("textbox"));
      await userEvent.click(screen.getByAltText("Masquer les options"));
      expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    });
  });
});
