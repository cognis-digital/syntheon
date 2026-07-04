import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

describe("Breadcrumb", () => {
  it("renders a nav labelled breadcrumb with a link and current page", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
    const page = screen.getByText("Settings");
    expect(page).toHaveAttribute("aria-current", "page");
  });
});
