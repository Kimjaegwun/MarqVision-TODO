## Marq Todo (Next.js + TypeScript)

### 실행 방법

- 설치:
  - yarn: `yarn`
- 개발 서버: `yarn dev` → `http://localhost:3000`
- 프로덕션 빌드/실행:
  - 빌드: `yarn run build`
  - 실행: `yarn run start`
- 테스트: `yarn test`

### 기술 스택 & 선택 이유

- Next.js 15 + React 19: App Router 기반 구조와 빠른 개발 경험(Turbopack).
- TypeScript: 정적 타입으로 도메인 모델(`TodoType`) 안정성 확보.
- TanStack React Query v5: 비동기 캐시/무한 스크롤/낙관적 업데이트에 최적화.
- MSW: 브라우저/테스트 환경 공통 API 모킹(`src/mocks/handlers.ts`).
- CSS Modules: 컴포넌트 단위 캡슐화된 스타일.
- Jest + Testing Library: 사용자 관점의 UI 동작 테스트.

### 폴더 구조

- `src/app/`: Next.js 앱 루트(레이아웃/페이지)
- `src/features/todo/`: 도메인 폴더
  - `components/`: UI 컴포넌트(`card`, `list`, `layout`)
  - `hooks/`: 커스텀 훅(조회/추가/수정/삭제/완료)
- `src/services/todo.ts`: API 호출 래퍼
- `src/mocks/`
  - `handlers.ts`: Mock API 엔드포인트(단일 진실 소스)
  - `browser.ts` / `server.ts`: MSW 워커/서버 초기화
- `src/shared/`
  - `hooks`: 공용 로직 폴더
  - `components/`: 공용 컴포넌트 폴더
- `src/test/`: 테스트 유틸, 세팅
- `src/types`: 도메인 타입

### 주요 설계/제약 로직

- 완료 제약(`완료 토글`):
  - 해당 투두가 참조(`references`)하는 모든 투두가 완료 상태일 때만 완료로 전환 가능.
  - 해당 투두를 참조하는 다른 투두 중 완료된 항목이 있으면 완료 해제 불가.
  - 서버 기준 로직: `handlers.ts`의 `PUT /api/todos/:id/complete`
- 삭제 정책:
  - 다른 투두가 해당 투두를 참조 중이면 삭제 불가(서버 400 반환).
  - 클라이언트 사전 검사 및 알림: `useDeleteTodo.ts`
  - 서버 기준 로직: `handlers.ts`의 `DELETE /api/todos/:id`
- 페이지네이션:
  - 커서 기반 페이지네이션(`nextCursor`, `hasMore`) + 무한 스크롤.
  - 인터섹션 옵저버 훅: `src/shared/hooks/useIntersection.tsx`
  - 목록 훅: `useGetTodoList`
- 낙관적 업데이트:
  - 추가/삭제/수정/완료 시 캐시 우선 반영 후 서버 응답에 동기화(실패 시 롤백).

### 테스트 실행/구성

- 러너/환경: Jest + jsdom, Testing Library
- 공통 모킹: 테스트 시작 시 MSW 서버(`src/test/setup.ts`)로 핸들러 공유
- 실행: `yarn test`

### 가산점 구현

- [o] Optimistic update
- [o] Mock API 연동 (MSW 핸들러로 구현)
- [o] 유닛 테스트 (추가/수정/삭제 흐름)

### 데모 시나리오

1. 할일 생성 → 2) 참조 추가 → 3) 완료 제약 확인(참조 미완료 시 완료 불가) → 4) 수정/삭제(참조 중 삭제 불가 안내) → 5) 스크롤시 추가 로드
