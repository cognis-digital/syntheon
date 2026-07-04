import { render, screen } from "@testing-library/react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";

describe("Tooltip", () => {
  it("renders the trigger inside a provider", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });
});
