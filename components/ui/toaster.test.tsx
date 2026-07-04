import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Toaster } from "./toaster";
import { toast } from "@/hooks/use-toast";

describe("Toaster", () => {
  it("renders a toast title after toast() is called", async () => {
    render(<Toaster />);
    act(() => {
      toast({ title: "Saved successfully" });
    });
    expect(await screen.findByText("Saved successfully")).toBeInTheDocument();
  });
});
