import { describe, expect, it } from "bun:test";
import { isDevlogSession, validateSession } from "./index.js";
import type { DevlogSession } from "./schema.js";

describe("Devlog SDK - Schema Validation", () => {
  const validSession: DevlogSession = {
    schemaVersion: "devlog.session.v1",
    sessionId: "123e4567-e89b-12d3-a456-426614174000",
    title: "Test Session",
    createdAt: "2026-02-06T12:00:00Z",
    updatedAt: "2026-02-06T12:00:00Z",
    source: {
      client: "cursor",
      clientVersion: "0.1.0",
    },
    tags: ["test", "tdd"],
    audience: "public",
    redaction: {
      applied: false,
      policy: "none",
    },
    messages: [
      {
        id: "msg-1",
        ts: "2026-02-06T12:00:10Z",
        role: "user",
        content: [{ type: "text", text: "Hello world" }],
      },
    ],
    artifacts: [],
  };

  it("should validate a correct session", () => {
    const validated = validateSession(validSession);
    expect(validated).toEqual(validSession);
    expect(isDevlogSession(validSession)).toBe(true);
  });

  it("should fail validation if schemaVersion is incorrect", () => {
    const invalid = { ...validSession, schemaVersion: "invalid.v1" };
    expect(() => validateSession(invalid)).toThrow();
    expect(isDevlogSession(invalid)).toBe(false);
  });

  it("should fail validation if sessionId is not a UUID", () => {
    const invalid = { ...validSession, sessionId: "not-a-uuid" };
    expect(() => validateSession(invalid)).toThrow();
  });

  it("should fail validation if createdAt is not a valid ISO8601", () => {
    const invalid = { ...validSession, createdAt: "2026-02-06 12:00:00" };
    expect(() => validateSession(invalid)).toThrow();
  });

  it("should validate a session with artifacts and outputs", () => {
    const sessionWithArtifacts: DevlogSession = {
      ...validSession,
      artifacts: [
        {
          kind: "file",
          name: "test.ts",
          contentType: "text/typescript",
          content: "console.log('test')",
          createdAt: "2026-02-06T12:01:00Z",
        },
      ],
      outputs: {
        post: {
          frontmatter: {
            title: "Test Post",
            date: "2026-02-06",
            tags: ["test"],
            draft: false,
          },
          markdown: "# Hello\nWorld",
          assets: [],
        },
      },
    };
    expect(isDevlogSession(sessionWithArtifacts)).toBe(true);
  });

  it("should fail if post date is in wrong format", () => {
    const invalid = {
      ...validSession,
      outputs: {
        post: {
          frontmatter: {
            title: "Test Post",
            date: "2026/02/06", // Wrong format
            tags: [],
            draft: false,
          },
          markdown: "",
          assets: [],
        },
      },
    };
    expect(isDevlogSession(invalid)).toBe(false);
  });
});
