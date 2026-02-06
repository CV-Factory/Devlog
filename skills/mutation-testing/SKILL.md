---
name: mutation-testing
description: 돌연변이 테스트를 병렬로 수행하는 절차. 프론트는 Stryker(Vitest, incremental), 백엔드는 Cosmic Ray(http-worker, docker-compose) 기반으로 실행하고 리포트를 생성.
---

## When to Use

- 핵심 도메인 로직, 인증/권한, 파일 처리, 워크플로우, 장애/예외 처리 등 회귀 리스크가 큰 변경

## Frontend (TypeScript) — Stryker

### Run

- `npm run test:mutation --filter frontend`

### Notes

- 설정은 `apps/frontend/stryker.config.json`을 따른다
- incremental이 활성화되어 있으므로 증분 실행을 우선한다
- 빌드/테스트 시간을 줄이기 위해 캐싱/증분 처리(가능한 범위)를 항상 우선한다

## Backend (Python) — Cosmic Ray (Container + Parallel Workers)

### Run

- 워커/러너/DB를 포함해 병렬 실행: `docker compose -f apps/backend/docker-compose.test.yaml up --build cosmic-worker-1 cosmic-worker-2 cosmic-runner`

### Notes

- 컨테이너 기반 병렬 실행을 표준으로 한다
- **백엔드 돌연변이 테스트(Cosmic Ray)는 도구의 기술적 제약(SQLAlchemy/SQLite 결합)으로 인해 세션 데이터베이스로 SQLite를 사용한다.**
- 빌드 시간을 줄이기 위해 기존 이미지/레이어 캐시를 재사용하고, 필요한 경우에만 재빌드를 수행한다

### Outputs

- 리포트/HTML 출력은 compose 내 러너 커맨드가 생성한다

## Completion Criteria

- 실행이 실패하지 않고 리포트가 생성됨
- 생존(survived) 돌연변이가 발생하면, 테스트 보강 또는 설계/검증 로직 개선으로 제거
