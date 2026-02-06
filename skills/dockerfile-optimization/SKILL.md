---
name: devlog-dockerfile-optimization
description: Devlog 프로젝트의 Dockerfile 변경 시 레이어 캐싱 극대화 절차.
---

## When to Use

- 프로젝트 내의 Dockerfile 또는 이미지 빌드 스크립트를 수정할 때

## Rules

- **멀티 스테이지 빌드**: 빌드 환경과 실행 환경을 분리하여 최종 이미지 크기를 최소화한다.
- **의존성 설치 최적화**: 캐싱을 위해 락 파일과 패키지 정의 파일을 소스 코드보다 먼저 복사한다.
- **레이어 캐싱**: 변경이 잦은 소스 코드는 Dockerfile의 하단에 배치한다.
- **불필요한 파일 제외**: `.dockerignore`를 적절히 활용하여 빌드 산출물 등이 레이어에 포함되지 않게 한다.

## Validation

- 빌드 스크립트를 통해 빌드가 성공하는지 확인한다.
- 생성된 이미지의 크기와 레이어 구조를 확인한다.
