import { task } from "@trigger.dev/sdk/v3";

export const helloWorld = task({
  id: "helloWorld",
  run: async () => {
    console.log("Hello from Trigger.dev!");
  },
});
