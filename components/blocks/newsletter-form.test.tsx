import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { NewsletterForm } from "./newsletter-form";

describe("NewsletterForm", () => {
  it("shows a validation error for an invalid email", async () => {
    render(<NewsletterForm />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "not-an-email" } });

    fireEvent.click(
      screen.getByRole("button", { name: "Join the waitlist" }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/valid email/i);
  });

  it("calls onSubmit and shows the success message for a valid email", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <NewsletterForm onSubmit={onSubmit} successMessage="Thanks for joining!" />,
    );

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "chris@example.com" } });

    fireEvent.click(
      screen.getByRole("button", { name: "Join the waitlist" }),
    );

    expect(await screen.findByText("Thanks for joining!")).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith("chris@example.com");
  });
});
