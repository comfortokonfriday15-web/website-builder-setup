# Trigger.dev v4 — Complete Reference

## Basic Tasks

**MUST use `@trigger.dev/sdk`, NEVER `client.defineJob`**

```ts
import { task } from "@trigger.dev/sdk";

export const processData = task({
  id: "process-data",
  retry: {
    maxAttempts: 10,
    factor: 1.8,
    minTimeoutInMs: 500,
    maxTimeoutInMs: 30_000,
    randomize: false,
  },
  run: async (payload: { userId: string; data: any[] }) => {
    console.log(`Processing ${payload.data.length} items for user ${payload.userId}`);
    return { processed: payload.data.length };
  },
});
```

## Schema Task (with validation)

```ts
import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

export const validatedTask = schemaTask({
  id: "validated-task",
  schema: z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
  }),
  run: async (payload) => {
    return { message: `Hello ${payload.name}, age ${payload.age}` };
  },
});
```

## Triggering Tasks

### From Backend Code

```ts
import { tasks } from "@trigger.dev/sdk";
import type { processData } from "./trigger/tasks";

const handle = await tasks.trigger<typeof processData>("process-data", {
  userId: "123",
  data: [{ id: 1 }, { id: 2 }],
});

const batchHandle = await tasks.batchTrigger<typeof processData>("process-data", [
  { payload: { userId: "123", data: [{ id: 1 }] } },
  { payload: { userId: "456", data: [{ id: 2 }] } },
]);
```

### Debounced Triggering

```ts
await myTask.trigger(
  { userId: "123" },
  {
    debounce: {
      key: "user-123-update",
      delay: "5s",
    },
  }
);

await myTask.trigger(
  { data: "latest-value" },
  {
    debounce: {
      key: "trailing-example",
      delay: "10s",
      mode: "trailing",  // leading (default) or trailing
    },
  }
);
```

### From Inside Tasks (with Result handling)

```ts
export const parentTask = task({
  id: "parent-task",
  run: async (payload) => {
    const handle = await childTask.trigger({ data: "value" });

    const result = await childTask.triggerAndWait({ data: "value" });
    if (result.ok) {
      console.log("Task output:", result.output);
    } else {
      console.error("Task failed:", result.error);
    }

    const output = await childTask.triggerAndWait({ data: "value" }).unwrap();

    const results = await childTask.batchTriggerAndWait([
      { payload: { data: "item1" } },
      { payload: { data: "item2" } },
    ]);
  },
});

export const childTask = task({
  id: "child-task",
  run: async (payload: { data: string }) => {
    return { processed: payload.data };
  },
});
```

> Never wrap triggerAndWait or batchTriggerAndWait in Promise.all / Promise.allSettled

## Waits

```ts
import { task, wait } from "@trigger.dev/sdk";

export const taskWithWaits = task({
  id: "task-with-waits",
  run: async (payload) => {
    await wait.for({ seconds: 30 });
    await wait.for({ minutes: 5 });
    await wait.for({ hours: 1 });
    await wait.for({ days: 1 });
    await wait.until({ date: new Date("2024-12-25") });
    await wait.forToken({
      token: "user-approval-token",
      timeoutInSeconds: 3600,
    });
    return { status: "completed" };
  },
});
```

> Never wrap wait calls in Promise.all / Promise.allSettled

## Tags & Organization

```ts
import { task, tags } from "@trigger.dev/sdk";

export const processUser = task({
  id: "process-user",
  run: async (payload: { userId: string; orgId: string }, { ctx }) => {
    await tags.add(`user_${payload.userId}`);
    await tags.add(`org_${payload.orgId}`);
    return { processed: true };
  },
});

await processUser.trigger(
  { userId: "123", orgId: "abc" },
  { tags: ["priority", "user_123", "org_abc"] }
);

for await (const run of runs.subscribeToRunsWithTag("user_123")) {
  console.log(`User task ${run.id}: ${run.status}`);
}
```

**Tag best practices:** Prefixes like `user_123`, `org_abc`. Max 10 tags per run, 1-64 chars. Tags don't propagate to child tasks.

## Concurrency & Queues

```ts
import { task, queue } from "@trigger.dev/sdk";

const emailQueue = queue({
  name: "email-processing",
  concurrencyLimit: 5,
});

export const oneAtATime = task({
  id: "sequential-task",
  queue: { concurrencyLimit: 1 },
  run: async (payload) => {
    // Only one instance runs at a time
  },
});

export const processUserData = task({
  id: "process-user-data",
  run: async (payload: { userId: string }) => {
    await childTask.trigger(payload, {
      queue: {
        name: `user-${payload.userId}`,
        concurrencyLimit: 2,
      },
    });
  },
});

export const emailTask = task({
  id: "send-email",
  queue: emailQueue,
  run: async (payload: { to: string }) => {},
});
```

## Error Handling & Retries

```ts
import { task, retry, AbortTaskRunError } from "@trigger.dev/sdk";

export const resilientTask = task({
  id: "resilient-task",
  retry: {
    maxAttempts: 10,
    factor: 1.8,
    minTimeoutInMs: 500,
    maxTimeoutInMs: 30_000,
    randomize: false,
  },
  catchError: async ({ error, ctx }) => {
    if (error.code === "FATAL_ERROR") {
      throw new AbortTaskRunError("Cannot retry this error");
    }
    console.error(`Task ${ctx.task.id} failed:`, error);
    return { retryAt: new Date(Date.now() + 60000) };
  },
  run: async (payload) => {
    const result = await retry.onThrow(
      async () => await unstableApiCall(payload),
      { maxAttempts: 3 }
    );

    const response = await retry.fetch("https://api.example.com", {
      retry: {
        maxAttempts: 5,
        condition: (response, error) => {
          return response?.status === 429 || response?.status >= 500;
        },
      },
    });

    return result;
  },
});
```

## Machines & Performance

```ts
export const heavyTask = task({
  id: "heavy-computation",
  machine: { preset: "large-2x" },  // 8 vCPU, 16 GB RAM
  maxDuration: 1800,
  run: async (payload, { ctx }) => {
    return await parallelProcessing(payload);
  },
});
```

**Presets:** `micro` (0.25 vCPU) | `small-1x` (0.5 vCPU, default) | `small-2x` | `medium-1x` | `medium-2x` | `large-1x` | `large-2x` (8 vCPU, 16 GB)

## Idempotency

```ts
import { task, idempotencyKeys } from "@trigger.dev/sdk";

export const paymentTask = task({
  id: "process-payment",
  retry: { maxAttempts: 3 },
  run: async (payload: { orderId: string; amount: number }) => {
    const idempotencyKey = await idempotencyKeys.create(`payment-${payload.orderId}`);
    await chargeCustomer.trigger(payload, {
      idempotencyKey,
      idempotencyKeyTTL: "24h",
    });
  },
});
```

## Metadata & Progress Tracking

```ts
import { task, metadata } from "@trigger.dev/sdk";

export const batchProcessor = task({
  id: "batch-processor",
  run: async (payload: { items: any[] }, { ctx }) => {
    metadata
      .set("progress", 0)
      .set("totalItems", payload.items.length)
      .set("status", "starting");

    for (let i = 0; i < payload.items.length; i++) {
      await processItem(payload.items[i]);
      const progress = ((i + 1) / payload.items.length) * 100;
      metadata.set("progress", progress).increment("processedItems", 1);
    }

    metadata.set("status", "completed");
    return { totalProcessed: payload.items.length };
  },
});

// Update parent metadata from child
export const childTask = task({
  id: "child-task",
  run: async (payload, { ctx }) => {
    metadata.parent.set("childStatus", "processing");
    metadata.root.increment("childrenCompleted", 1);
    return { processed: true };
  },
});
```

## Logging & Tracing

```ts
import { task, logger } from "@trigger.dev/sdk";

export const tracedTask = task({
  id: "traced-task",
  run: async (payload, { ctx }) => {
    logger.info("Task started", { userId: payload.userId });

    const user = await logger.trace("fetch-user", async (span) => {
      span.setAttribute("user.id", payload.userId);
      return await database.findUser(payload.userId);
    }, { userId: payload.userId });

    try {
      return await processUser(user);
    } catch (error) {
      logger.error("Processing failed", { error: error.message });
      throw error;
    }
  },
});
```

## Hidden Tasks

```ts
const internalProcessor = task({
  id: "internal-processor",
  run: async (payload: { data: string }) => {
    return { processed: payload.data.toUpperCase() };
  },
});

export const publicWorkflow = task({
  id: "public-workflow",
  run: async (payload: { input: string }) => {
    const result = await internalProcessor.triggerAndWait({ data: payload.input });
    if (result.ok) return { output: result.output.processed };
    throw new Error("Internal processing failed");
  },
});
```

## Scheduled Tasks (Cron)

```ts
import { schedules } from "@trigger.dev/sdk";

export const task = schedules.task({
  id: "every-2h",
  cron: "0 */2 * * *",
  run: async (payload) => {
    payload.timestamp;   // Date (scheduled time, UTC)
    payload.lastTimestamp; // Date | undefined
    payload.timezone;     // IANA timezone
    payload.scheduleId;   // string
    payload.externalId;   // string | undefined
    payload.upcoming;     // Date[]
  },
});

// With timezone and environment filter
schedules.task({
  id: "tokyo-5am",
  cron: { pattern: "0 5 * * *", timezone: "Asia/Tokyo", environments: ["PRODUCTION"] },
  run: async () => {},
});

// Imperative schedule creation
await schedules.create({
  task: task.id,
  cron: "0 0 * * *",
  timezone: "America/New_York",
  externalId: "user_123",
  deduplicationKey: "user_123-daily",
});
```

### Cron syntax

```
* * * * *
| | | | └ day of week (0-7, L=last)
| | | └── month (1-12)
| | └──── day of month (1-31, L=last)
| └────── hour (0-23)
└──────── minute (0-59)
```

## Realtime

```ts
import { auth } from "@trigger.dev/sdk";

// Public access token for frontend
const publicToken = await auth.createPublicToken({
  scopes: { read: { runs: ["run_123"] } },
  expirationTime: "1h",
});
```

### Backend subscriptions

```ts
import { runs, tasks } from "@trigger.dev/sdk";

const handle = await tasks.trigger("my-task", { data: "value" });

for await (const run of runs.subscribeToRun(handle.id)) {
  console.log(`Status: ${run.status}, Progress: ${run.metadata?.progress}`);
  if (run.status === "COMPLETED") break;
}
```

### React hooks (frontend)

```tsx
"use client";
import { useTaskTrigger, useRealtimeTaskTrigger, useRealtimeRun } from "@trigger.dev/react-hooks";
import type { myTask } from "../trigger/tasks";

function Component({ accessToken }: { accessToken: string }) {
  const { submit, handle, isLoading } = useTaskTrigger<typeof myTask>("my-task", { accessToken });

  const { submit: rtSubmit, run } = useRealtimeTaskTrigger<typeof myTask>("my-task", { accessToken });

  const { run: subRun } = useRealtimeRun<typeof myTask>(runId, { accessToken });

  return <button onClick={() => submit({ data: "value" })}>Trigger</button>;
}
```

## Trigger.dev Configuration

```ts
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_uarhhhbeypmgfxmdprzu",
  dirs: ["./src/trigger"],
  runtime: "node",
  logLevel: "log",
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  build: {
    autoDetectExternal: true,
    keepNames: true,
    minify: false,
    extensions: [],
  },
});
```

### Build Extensions

| Extension | Package | Use Case |
|-----------|---------|----------|
| Prisma | `@trigger.dev/build/extensions/prisma` | Database ORM |
| Python | `@trigger.dev/build/extensions/python` | Run Python scripts |
| Playwright | `@trigger.dev/build/extensions/playwright` | Browser automation |
| Puppeteer | `@trigger.dev/build/extensions/puppeteer` | Browser automation |
| FFmpeg | `@trigger.dev/build/extensions/core` | Media processing |
| aptGet | `@trigger.dev/build/extensions/core` | System packages |
| additionalPackages | `@trigger.dev/build/extensions/core` | CLI tools |
| additionalFiles | `@trigger.dev/build/extensions/core` | Extra files in deployment |
| syncEnvVars | `@trigger.dev/build/extensions/core` | Dynamic env vars |
| emitDecoratorMetadata | `@trigger.dev/build/extensions/typescript` | TypeORM decorators |

## CLI Commands

| Command | Description |
|---------|-------------|
| `trigger dev` | Run local dev server, watch `src/trigger/` |
| `trigger deploy` | Deploy tasks to cloud |
| `trigger whoami` | Show authenticated account + project |
| `trigger init` | Initialize a new project |

## Best Practices

- **Concurrency**: Use queues to prevent overwhelming external services
- **Retries**: Configure exponential backoff for transient failures
- **Idempotency**: Always use for payment/critical operations
- **Metadata**: Track progress for long-running tasks
- **Tags**: Use consistent naming patterns (`user_123`, `org_abc`)
- **Debouncing**: Use for user activity, webhooks, notification batching
- **Batch triggering**: Up to 1,000 items, 3MB per payload
- **Error handling**: Distinguish retryable vs fatal errors (use `AbortTaskRunError`)
- **Waits > 5s**: Automatically checkpointed, don't count toward compute
