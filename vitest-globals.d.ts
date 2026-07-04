// Makes Vitest's globals (describe/it/expect/vi/beforeEach/…) available to the
// TypeScript checker, matching `globals: true` in vitest.config.ts. Also pulls in
// the jest-dom matcher augmentation used via vitest.setup.ts.
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
