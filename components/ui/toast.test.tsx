import { render, screen } from "@testing-library/react";
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

describe("Toast", () => {
  it("renders an open toast with its title", () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Saved!</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });
});
