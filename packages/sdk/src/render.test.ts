import { describe, expect, it } from "bun:test";
import { renderPost } from "./render.js";
import type { DevlogSession } from "./schema.js";

describe("renderPost", () => {
  const mockSession: DevlogSession = {
    schemaVersion: "devlog.session.v1",
    sessionId: "123e4567-e89b-12d3-a456-426614174000",
    title: "TDD Study Log",
    createdAt: "2026-02-06T12:00:00Z",
    updatedAt: "2026-02-06T12:00:00Z",
    source: { client: "cursor" },
    tags: ["tdd", "typescript"],
    audience: "public",
    redaction: { applied: false, policy: "" },
    messages: [
      {
        id: "1",
        ts: "2026-02-06T12:00:10Z",
        role: "user",
        content: [{ type: "text", text: "How to do TDD?" }],
      },
      {
        id: "2",
        ts: "2026-02-06T12:01:00Z",
        role: "assistant",
        content: [
          { type: "text", text: "Follow Red-Green-Refactor." },
          { type: "code", lang: "typescript", text: "const a = 1;" },
        ],
      },
    ],
    artifacts: [],
  };

  it("should render a session into a PostArtifact with correct frontmatter", () => {
    const post = renderPost(mockSession);

    expect(post.frontmatter.title).toBe(mockSession.title);
    expect(post.frontmatter.date).toBe("2026-02-06");
    expect(post.frontmatter.tags).toContain("tdd");
  });

  it("should include messages in the markdown content", () => {
    const post = renderPost(mockSession);

    expect(post.markdown).toContain("How to do TDD?");
    expect(post.markdown).toContain("Follow Red-Green-Refactor.");
    expect(post.markdown).toContain("```typescript\nconst a = 1;\n```");
  });
});
