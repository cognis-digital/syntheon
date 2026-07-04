import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./pagination";

describe("Pagination", () => {
  it("renders a labelled nav with the active page marked aria-current", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(screen.getByRole("navigation", { name: "pagination" })).toBeInTheDocument();
    const active = screen.getByText("2");
    expect(active).toHaveAttribute("aria-current", "page");
    const inactive = screen.getByText("1");
    expect(inactive).not.toHaveAttribute("aria-current");
  });
});
