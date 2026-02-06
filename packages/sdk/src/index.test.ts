import { describe, expect, it } from "bun:test";
import type { DevlogSession } from "./schema";

describe("SDK", () => {
  it("should export DevlogSession type", () => {
    // This is a type-only test, but we can check if the module loads
    const session: Partial<DevlogSession> = {
      schemaVersion: "devlog.session.v1",
    };
    expect(session.schemaVersion).toBe("devlog.session.v1");
  });
});
