import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("renders the fallback text when the image does not load", async () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.png" alt="user" />
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>,
    );

    // jsdom does not load images, so the fallback is shown.
    expect(await screen.findByText("CD")).toBeInTheDocument();
  });
});
