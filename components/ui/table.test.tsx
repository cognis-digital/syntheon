import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./table";

describe("Table", () => {
  it("renders headers, cells, caption and the correct roles", () => {
    render(
      <Table>
        <TableCaption>A list of users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
            <TableCell>Engineer</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("A list of users")).toBeInTheDocument();
    // thead + tbody -> at least two rowgroups
    expect(screen.getAllByRole("rowgroup").length).toBeGreaterThanOrEqual(2);
  });
});
