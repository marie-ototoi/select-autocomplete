import React from "react";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
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
  it("should render label", () => {
    render(<SelectAutocomplete {...props} />);
    expect(screen.getByLabelText("Pays")).toBeInTheDocument();
  });
  it("should render field with selected option", () => {
    render(<SelectAutocomplete {...props} />);
    expect(screen.getByLabelText("Pays")).toHaveValue("fr");
  });
  describe("multiple", () => {
    it("should render field with selected options", () => {
      render(<SelectAutocomplete {...{ ...props, multi: true }} />);
      expect(screen.getByLabelText("Pays")).toHaveValue(["fr"]);
    });
  });
  describe("display options", () => {
    it("should not display options at first display", () => {
      render(<SelectAutocomplete {...props} />);
      expect(
        screen.queryByRole("listitem", { name: "France" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("listitem", { name: "Italie" })
      ).not.toBeInTheDocument();
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
    it("should display mark selected options as selected", async () => {
      const { container } = render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("textbox"));
      const selected = container.querySelectorAll("li[data-selected=true]");
      expect(selected).toHaveLength(props.selectedOptions.length);
    });
  });
  describe("select options", () => {
    it("should select only one option", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("textbox"));
      const list = await screen.getByRole("list");
      await userEvent.click(await within(list).findByText("Italie"));
      expect(screen.getByRole("combobox")).toHaveValue("it");
    });
    it("should close list after selection", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("textbox"));
      const list = await screen.getByRole("list");
      await userEvent.click(await within(list).findByText("Italie"));
      expect(within(list).queryByText("Italie")).not.toBeInTheDocument();
    });
    it("should unselect selected option", async () => {
      const unselectedValues = ["France"];
      const { container } = render(<SelectAutocomplete {...props} />);
      await userEvent.click(screen.getByRole("textbox"));
      await userEvent.click(await screen.findAllByText("France")[1]);
      const selected = container.querySelectorAll("li[data-selected=true]");
      expect(selected).toHaveLength(
        props.selectedOptions.length - unselectedValues.length
      );
    });
    describe("multiple", () => {
      it("should leave list open after selection", async () => {
        render(<SelectAutocomplete {...{ ...props, multi: true }} />);
        await userEvent.click(screen.getByRole("textbox"));
        const list = await screen.getByRole("list");
        await userEvent.click(await within(list).findByText("Italie"));
        expect(await within(list).findByText("Italie")).toBeInTheDocument();
      });
    });
  });
  describe("filter options", () => {
    it("should filter options when the user types in the field", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.type(screen.getByRole("textbox"), "an");
      expect(screen.getAllByRole("listitem")).toHaveLength(
        ["France", "Danemark"].length
      );
    });
    it("should reset filter when the user closes and reopens the field", async () => {
      render(<SelectAutocomplete {...props} />);
      await userEvent.type(screen.getByRole("textbox"), "an");
      await userEvent.click(screen.getByAltText("Masquer les options"));
      await userEvent.click(screen.getByAltText("Afficher les options"));
      expect(screen.getAllByRole("listitem")).toHaveLength(
        props.options.length
      );
    });
  });
});
