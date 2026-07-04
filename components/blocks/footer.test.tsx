import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Footer } from "./footer";

describe("Footer", () => {
  const columns = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
  ];

  it("renders columns, links, and default copyright", () => {
    render(<Footer columns={columns} />);

    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Features" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pricing" })).toBeInTheDocument();

    // Default copyright line contains the Syntheon brand
    expect(
      screen.getByText(/Syntheon\. You own every line\./),
    ).toBeInTheDocument();
  });

  it("renders a custom copyright when provided", () => {
    render(<Footer columns={columns} copyright={<span>© 2026 Acme</span>} />);
    expect(screen.getByText("© 2026 Acme")).toBeInTheDocument();
  });
});
