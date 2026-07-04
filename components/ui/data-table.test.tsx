import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { DataTable, type DataTableColumn } from "./data-table";

type Row = { name: string; age: number };

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Name" },
  { key: "age", header: "Age", sortable: true, sortValue: (r) => r.age },
];

const data: Row[] = [
  { name: "Bob", age: 30 },
  { name: "Ada", age: 20 },
  { name: "Cy", age: 40 },
];

function ageOrder(): string[] {
  // Second cell in each body row is the age.
  return screen
    .getAllByRole("row")
    .slice(1) // drop header row
    .map((row) => within(row).getAllByRole("cell")[1].textContent);
}

describe("DataTable", () => {
  it("renders headers and cell values", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("sorts ascending then descending when the sortable header is clicked", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(ageOrder()).toEqual(["30", "20", "40"]); // unsorted (original order)

    const sortBtn = screen.getByRole("button", { name: /Sort by Age/ });
    fireEvent.click(sortBtn);
    expect(ageOrder()).toEqual(["20", "30", "40"]); // asc

    fireEvent.click(sortBtn);
    expect(ageOrder()).toEqual(["40", "30", "20"]); // desc
  });

  it("shows the empty message with no data", () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
