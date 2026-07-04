import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "./alert";

describe("Alert", () => {
  it("renders with role alert and shows title + description", () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something happened.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Something happened.")).toBeInTheDocument();
  });
});
