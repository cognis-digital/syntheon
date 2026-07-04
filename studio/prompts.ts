/**
 * Syntheon prompt driver — a thin, injectable seam over @clack/prompts.
 *
 * The CLI never calls @clack directly for its interactive flow; it goes
 * through a {@link Prompter}. In production that is {@link clackPrompter};
 * tests inject a scripted prompter to exercise prompt-to-config mapping with
 * no TTY. Cancellation surfaces as a thrown {@link PromptCancelled}.
 */
import * as p from "@clack/prompts";
import type { FeatureCategory } from "./types.js";

export class PromptCancelled extends Error {
  constructor() {
    super("Prompt cancelled.");
    this.name = "PromptCancelled";
  }
}

export interface Choice {
  value: string;
  label: string;
  hint?: string;
}

export interface Prompter {
  text(opts: { message: string; placeholder?: string; initial?: string }): Promise<string>;
  select(opts: { message: string; options: Choice[]; initial?: string }): Promise<string>;
  multiselect(opts: {
    message: string;
    options: Choice[];
    initial?: string[];
    required?: boolean;
  }): Promise<string[]>;
  confirm(opts: { message: string; initial?: boolean }): Promise<boolean>;
}

/** The real @clack-backed prompter. */
export const clackPrompter: Prompter = {
  async text(opts) {
    const r = await p.text({
      message: opts.message,
      placeholder: opts.placeholder,
      defaultValue: opts.initial,
      initialValue: opts.initial,
    });
    if (p.isCancel(r)) throw new PromptCancelled();
    return r;
  },
  async select(opts) {
    const r = await p.select({
      message: opts.message,
      options: opts.options,
      initialValue: opts.initial,
    });
    if (p.isCancel(r)) throw new PromptCancelled();
    return r as string;
  },
  async multiselect(opts) {
    const r = await p.multiselect({
      message: opts.message,
      options: opts.options,
      initialValues: opts.initial,
      required: opts.required ?? false,
    });
    if (p.isCancel(r)) throw new PromptCancelled();
    return r as string[];
  },
  async confirm(opts) {
    const r = await p.confirm({ message: opts.message, initialValue: opts.initial });
    if (p.isCancel(r)) throw new PromptCancelled();
    return r;
  },
};

/** A convenience label for menu categories used in prompt copy. */
export const CATEGORY_LABEL: Record<FeatureCategory, string> = {
  core: "Core",
  pages: "Pages",
  auth: "Auth",
  payments: "Payments",
  scheduling: "Scheduling",
  email: "Email",
  crm: "CRM",
  integrations: "Integrations",
  ai: "AI",
  identity: "Identity / KYC",
  theme: "Theme",
};
