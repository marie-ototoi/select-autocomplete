import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import SelectAutocomplete from "../SelectAutocomplete";
import userEvent from "@testing-library/user-event";

describe("SelectAutocomplete", () => {
  const props = {
    label: "Pays",
    name: "country",
    options: [
      { label: "France", value: "fr" },
      { label: "Italie", value: "it" },
      { label: "Espagne", value: "es" },
      { label: "Danemark", value: "dk" },
      { label: "Suède", value: "sv" },
    ],
    selectedOptions: ["fr"],
  };
  it("should render input field", () => {
    render(<SelectAutocomplete {...props} />);
    expect(screen.getByLabelText("Pays")).toBeInTheDocument();
  });
  describe("display options", () => {
    it("should not display options at first display", () => {
      render(<SelectAutocomplete {...props} />);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    it("should open and display all options when the user focuses on the field", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("combobox", { name: "Pays" }));
      const list = screen.getByRole("listbox");
      expect(await within(list).findAllByRole("option")).toHaveLength(
        props.options.length
      );
    });
    it("should close and hide all options when the user triggers the close arrow button", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("combobox", { name: "Pays" }));
      await userEvent.click(screen.getByAltText("Masquer les options"));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    it("should close and hide options when the user focuses outside of the field", async () => {
      render(
        <>
          <button>Outside</button>
          <SelectAutocomplete {...props} />
        </>
      );
      await userEvent.click(screen.getByRole("combobox", { name: "Pays" }));
      await userEvent.click(
        await screen.findByRole("button", { name: "Outside" })
      );
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    it("should display selected options as selected", async () => {
      const { container } = render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("combobox", { name: "Pays" }));
      const selected = container.querySelectorAll("li[data-selected=true]");
      expect(selected).toHaveLength(props.selectedOptions.length);
    });
  });
  describe("filter options", () => {
    it("should filter options when the user types in the field", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.type(
        screen.getByRole("combobox", { name: "Pays" }),
        "an"
      );
      const list = screen.getByRole("listbox");
      expect(within(list).getAllByRole("option")).toHaveLength(
        ["France", "Danemark"].length
      );
    });
    it("should reset filter when the user closes and reopens the field", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.type(
        screen.getByRole("combobox", { name: "Pays" }),
        "an"
      );
      await userEvent.click(screen.getByAltText("Masquer les options"));
      await userEvent.click(screen.getByAltText("Afficher les options"));
      const list = screen.getByRole("listbox");
      expect(within(list).getAllByRole("option")).toHaveLength(
        props.options.length
      );
    });
  });
  describe("select options", () => {
    describe("single", () => {
      it("should preselect option", () => {
        render(<SelectAutocomplete {...props} />);
        expect(screen.getByTestId("select")).toHaveValue("fr");
      });
      it("should select only one option", async () => {
        render(<SelectAutocomplete {...props} />);

        await userEvent.click(screen.getByRole("combobox", { name: "Pays" }));
        const list = await screen.findByRole("listbox");
        await userEvent.click(
          await within(list).findByRole("option", { name: /Italie/ })
        );
        expect(screen.getByTestId("select")).toHaveValue("it");
      });
      it("should close list after selection", async () => {
        render(<SelectAutocomplete {...props} />);
        await userEvent.click(screen.getByRole("combobox", { name: "Pays" }));
        const list = await screen.findByRole("listbox");
        await userEvent.click(
          await within(list).findByRole("option", { name: "Italie" })
        );
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });
    describe("multiple", () => {
      it("should preselect multiple options", () => {
        render(<SelectAutocomplete {...{ ...props, multi: true }} />);
        expect(screen.getByTestId("select")).toHaveValue(["fr"]);
      });
      it("should unselect selected option", async () => {
        const unselectedValues = ["France"];
        const { container } = render(
          <SelectAutocomplete {...{ ...props, multi: true }} />
        );
        await userEvent.click(screen.getByRole("combobox", { name: "Pays" }));
        const list = await screen.findByTestId("list");
        await userEvent.click(await within(list).findByText("France"));
        const selected = container.querySelectorAll("li[data-selected=true]");
        expect(selected).toHaveLength(
          props.selectedOptions.length - unselectedValues.length
        );
      });
      it("should leave list open after selection", async () => {
        render(<SelectAutocomplete {...{ ...props, multi: true }} />);
        await userEvent.click(screen.getByRole("combobox", { name: "Pays" }));
        const list = await screen.findByTestId("list");
        await userEvent.click(
          await within(list).findByRole("option", { name: "Italie" })
        );
        expect(list).toBeInTheDocument();
      });
    });
  });
});
