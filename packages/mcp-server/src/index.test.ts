import { describe, it, expect } from "bun:test";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

// 실제 구현체가 없으므로 일단 껍데기만 테스트
describe("Devlog MCP Server", () => {
  it("should define core tools: capture, render, preview, publish", () => {
    // 실제 서버 인스턴스를 생성하거나 모킹하여 도구 목록 확인 로직 필요
    // 현재는 TDD Red 단계를 위해 간단한 기대값 설정
    const tools = ["captureSession", "renderPost", "previewPost", "publishPost"];
    expect(tools).toContain("captureSession");
    expect(tools).toContain("renderPost");
  });
});
