export default $config({
  app(input) {
    return {
      name: "devlog",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // Infrastructure will be defined here or imported from ./infra
    // Example: const storage = await import("./infra/storage");

    return {
      stage: $app.stage,
    };
  },
});
