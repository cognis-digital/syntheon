import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import BlogIndex from "./page";
import { POSTS, getPost, formatDate } from "./posts";

describe("Blog index", () => {
  it("renders the blog heading", () => {
    render(<BlogIndex />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Notes from the build engine/i }),
    ).toBeInTheDocument();
  });

  it("lists every post with a link to its slug", () => {
    render(<BlogIndex />);
    for (const post of POSTS) {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    }
    const link = screen.getAllByRole("link")[0];
    expect(link.getAttribute("href")).toContain("/blog/");
  });
});

describe("blog posts data", () => {
  it("resolves a known post by slug and returns undefined otherwise", () => {
    expect(getPost("zero-errors-or-it-doesnt-ship")?.title).toMatch(/Zero errors/i);
    expect(getPost("does-not-exist")).toBeUndefined();
  });

  it("formats ISO dates for display", () => {
    expect(formatDate("2026-01-15")).toMatch(/2026/);
  });
});
