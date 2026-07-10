import { defineConfig } from "@trigger.dev/sdk/v4";

export default defineConfig({
  project: "proj_booksmart",
  runtime: "node",
  logLevel: "debug",
  retries: {
    enabled: true,
    maxAttempts: 3,
  },
});
