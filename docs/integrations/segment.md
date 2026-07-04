# Segment

`track` + `identify` via the HTTP Tracking API using `fetch`.

## Setup

1. Create a source in Segment; copy its **Write Key** → `SEGMENT_WRITE_KEY`.

## Env

```
SEGMENT_WRITE_KEY=...
```

`isConfigured()` requires `SEGMENT_WRITE_KEY`.

## Usage

```ts
import { track, identify } from "@/lib/integrations/segment";

await identify({ userId: "u1" }, { email: "jane@x.co", plan: "pro" });
await track("Signed Up", { userId: "u1" }, { source: "pricing" });
```

Pass `userId` or `anonymousId` (at least one is required). Auth is HTTP Basic
with the write key as the username and an empty password.
