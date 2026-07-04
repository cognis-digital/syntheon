import { render, screen } from "@testing-library/react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select";

describe("Select", () => {
  it("renders the trigger with a placeholder", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
