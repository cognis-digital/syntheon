import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Faq } from "./faq";

describe("Faq", () => {
  const items = [
    { question: "What is Syntheon?", answer: "A self-hosted platform." },
    { question: "How much does it cost?", answer: "It is free and open." },
  ];

  it("renders questions as accordion triggers", () => {
    render(<Faq heading="FAQ" items={items} />);
    expect(screen.getByText("What is Syntheon?")).toBeInTheDocument();
    expect(screen.getByText("How much does it cost?")).toBeInTheDocument();
  });

  it("reveals the answer when a trigger is clicked", async () => {
    render(<Faq items={items} />);

    const trigger = screen.getByRole("button", { name: "What is Syntheon?" });
    fireEvent.click(trigger);

    expect(
      await screen.findByText("A self-hosted platform."),
    ).toBeInTheDocument();
  });
});
