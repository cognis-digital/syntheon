import { render, screen, fireEvent } from "@testing-library/react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";

describe("AlertDialog", () => {
  it("opens and shows content on trigger click", async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This is permanent.</AlertDialogDescription>
          <AlertDialogAction>Continue</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByText("Open"));
    expect(await screen.findByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});
