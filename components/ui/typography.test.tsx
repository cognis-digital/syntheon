import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyLead,
  TypographyMuted,
  TypographyInlineCode,
  TypographyBlockquote,
} from "./typography";

describe("Typography", () => {
  it("renders headings with the right levels", () => {
    render(
      <>
        <TypographyH1>Title 1</TypographyH1>
        <TypographyH2>Title 2</TypographyH2>
        <TypographyH3>Title 3</TypographyH3>
      </>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Title 1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Title 2" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Title 3" })).toBeInTheDocument();
  });

  it("renders paragraph, lead and muted text", () => {
    render(
      <>
        <TypographyP>Body paragraph</TypographyP>
        <TypographyLead>Lead paragraph</TypographyLead>
        <TypographyMuted>Muted paragraph</TypographyMuted>
      </>,
    );
    expect(screen.getByText("Body paragraph").tagName).toBe("P");
    expect(screen.getByText("Lead paragraph")).toBeInTheDocument();
    expect(screen.getByText("Muted paragraph")).toBeInTheDocument();
  });

  it("renders inline code and blockquote with correct tags", () => {
    render(
      <>
        <TypographyInlineCode>npm i</TypographyInlineCode>
        <TypographyBlockquote>A wise quote</TypographyBlockquote>
      </>,
    );
    expect(screen.getByText("npm i").tagName).toBe("CODE");
    expect(screen.getByText("A wise quote").tagName).toBe("BLOCKQUOTE");
  });
});
