export * from "./render.js";
export * from "./schema.js";

import { type DevlogSession, DevlogSessionSchema } from "./schema.js";

/**
 * DevlogSession 데이터의 유효성을 검증합니다.
 * @param data 검증할 데이터
 * @returns 검증된 DevlogSession 객체
 * @throws ZodError 유효하지 않은 데이터일 경우
 */
export function validateSession(data: unknown): DevlogSession {
  return DevlogSessionSchema.parse(data);
}

/**
 * 데이터가 유효한 DevlogSession인지 확인합니다. (Type Guard)
 * @param data 확인할 데이터
 */
export function isDevlogSession(data: unknown): data is DevlogSession {
  return DevlogSessionSchema.safeParse(data).success;
}
