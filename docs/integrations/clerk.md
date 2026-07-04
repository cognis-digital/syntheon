# Clerk

Auth, sign-in/up, and **waitlist** helpers. `@clerk/nextjs` powers the app
components/middleware; this adapter adds server-side helpers + a config guard.

## Setup

1. Create an app at [dashboard.clerk.com](https://dashboard.clerk.com).
2. Copy the **Publishable key** and **Secret key** from *API Keys*.
3. Enable the **Waitlist** feature (User & Authentication → Waitlist) if you use `addToWaitlist`.

## Env

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_WAITLIST_URL=/waitlist
```

`isConfigured()` requires the publishable + secret key.

## Usage

```ts
import { addToWaitlist, listWaitlist, authUrls, isConfigured } from "@/lib/integrations/clerk";

if (isConfigured()) {
  const entry = await addToWaitlist("user@example.com");
  const { signIn } = authUrls();
}
```

## Notes

- Waitlist calls hit the Clerk Backend API (`api.clerk.com/v1`).
- Never expose `CLERK_SECRET_KEY` client-side.
