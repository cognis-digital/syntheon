import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

describe("Card", () => {
  it("renders a composed card with all sections", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent>Some body content</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Manage your account settings.")).toBeInTheDocument();
    expect(screen.getByText("Some body content")).toBeInTheDocument();
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });
});
