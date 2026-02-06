---
name: devlog-docker-validation
description: Devlog 프로젝트의 로컬 환경 문제 발생 시 도커(Docker) 환경을 통한 무결성 검증 절차.
---

## When to Use

- **환경 종속성 이슈**: 로컬에 특정 라이브러리나 빌드 도구가 없어 빌드나 실행이 불가능할 때
- **의존성 변경 금지**: 로컬 환경 문제로 인해 프로젝트 설정을 수정하지 않고 컨테이너로 해결해야 할 때
- **OS 호환성**: Windows 등 로컬 OS에서 특정 도구가 오작동하거나 리눅스 전용 도구가 필요할 때
- **격리 검증**: CI 환경과 동일한 환경에서의 최종 검증이 필요할 때

## Key Principles

- **Zero-Modification Policy**: 로컬 환경의 미비함을 이유로 프로젝트의 의존성 구성이나 소스 코드를 임시로 수정하지 않는다.
- **Docker-First Resolution**: 모든 환경 이슈는 프로젝트 내의 Dockerfile을 활용하거나 확장하여 해결한다.

## Procedures

1. **도커 이미지 빌드**: 적절한 Dockerfile을 사용하여 이미지를 빌드한다.
2. **컨테이너 내 테스트 실행**:
   - `$env:COMPOSE_MENU='false'; docker compose run --rm <service> <test-command>`
3. **품질 게이트 검증**:
   - `$env:COMPOSE_MENU='false'; docker compose run --rm <service> <quality-gate-command>`
4. **환경 정리**: 검증 후 생성된 임시 컨테이너 및 볼륨을 제거한다. (`docker-compose down`)

## Checklist

- [ ] 도커 환경에서 모든 테스트가 통과하는가?
- [ ] 도커 내에서도 품질 게이트가 통과하는가?
- [ ] 표준 Docker 구성을 따랐는가?
