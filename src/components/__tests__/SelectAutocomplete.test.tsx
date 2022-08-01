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
      { label: "Espagne", value: "es" },
    ],
    selectedOptions: ["fr"],
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
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
    it("should close and hide options when the user focuses outside of the field", async () => {
      render(
        <>
          <button>Outside</button>
          <SelectAutocomplete {...props} />
        </>
      );
      await userEvent.click(screen.getByRole("textbox"));
      await userEvent.click(
        await screen.findByRole("button", { name: "Outside" })
      );
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });
    it("should display options as selected when the user selects them", async () => {
      const additionalValues = ["Italie"];
      const { container } = render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("textbox"));
      await userEvent.click(await screen.findByText("Italie"));
      const selected = container.querySelectorAll("li[data-selected=true]");
      expect(selected).toHaveLength(
        props.selectedOptions.length + additionalValues.length
      );
    });
    it("should not display options as selected when the user unselects them", async () => {
      const unselectedValues = ["France"];
      const { container } = render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("textbox"));
      await userEvent.click(await screen.findByText("France"));
      const selected = container.querySelectorAll("li[data-selected=true]");
      expect(selected).toHaveLength(
        props.selectedOptions.length - unselectedValues.length
      );
    });
  });
});
