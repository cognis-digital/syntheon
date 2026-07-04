import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
});

type FormValues = z.infer<typeof schema>;

function TestForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("shows a validation message when submitting an empty required field", async () => {
    render(<TestForm />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Username is required")).toBeInTheDocument();
  });
});
