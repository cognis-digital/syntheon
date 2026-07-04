import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./carousel";

describe("Carousel", () => {
  it("renders items and prev/next controls", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );

    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Slide 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument();
  });

  it("does not throw when clicking Next (jsdom scrollBy is a no-op)", () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselNext />
      </Carousel>,
    );
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "Next slide" })),
    ).not.toThrow();
  });
});
