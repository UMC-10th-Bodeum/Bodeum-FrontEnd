# Bodeum FrontEnd

## 📌 프로젝트 소개

보듬은 장애아동 부모들이 겪는 정보의 불균형과 심리적 고립감을 해소하기 위해 탄생한 맞춤형 복지 정보 플랫폼입니다.

## 👥 팀원 및 프론트엔드 역할 분담

| 이름                                    | 담당 영역                       |
| --------------------------------------- | ------------------------------- |
| [김은하](https://github.com/rladmsgki)  | HOME(+sidebar), INFO            |
| [심수아](https://github.com/Soo411)     | NEWS, Community, MyPage/Setting |
| [임정빈](https://github.com/Jungbin906) | AUTH/Onboarding, AI CHAT        |

## 🛠️ 기술 스택

| 분류       | 기술         |
| ---------- | ------------ |
| Language   | TypeScript   |
| Library    | React 19     |
| Build Tool | Vite         |
| Styling    | Tailwind CSS |
| Lint       | ESLint       |

## 📁 폴더 구조

```text
src/
├── apis/
├── assets/
├── components/
├── constants/
├── context/
├── enums/
├── hooks/
├── pages/
├── utils/
├── App.css
├── App.tsx
├── index.css
└── main.tsx
```

## 🤝 컨벤션 & 협업 규칙

### Branch Convention

브랜치명은 아래 형식을 따릅니다.

```text
type/#이슈번호-description
```

예시: feat/#12-login

| Type     | Description                       |
| -------- | --------------------------------- |
| feat     | 새로운 기능 개발                  |
| fix      | 버그 수정                         |
| hotfix   | 긴급 수정                         |
| refactor | 리팩토링                          |
| design   | UI 작업                           |
| style    | 코드 스타일 수정 (기능 변경 없음) |
| docs     | 문서 수정                         |
| chore    | 프로젝트 설정 및 패키지 관리      |
| test     | 테스트 코드 작성                  |

### Commit Convention

커밋 메시지는 다음 형식을 사용합니다.

```text
type: 내용
```

예시: feat: Button 컴포넌트 구현

| Type     | Description      |
| -------- | ---------------- |
| feat     | 새로운 기능 추가 |
| fix      | 버그 수정        |
| refactor | 리팩토링         |
| style    | 코드 스타일 수정 |
| docs     | 문서 수정        |
| test     | 테스트 코드      |
| chore    | 설정 변경        |
| build    | 빌드 관련        |
| ci       | CI/CD            |
| perf     | 성능 개선        |

### PR Convention

PR은 `.github/PULL_REQUEST_TEMPLATE.md` 템플릿을 기준으로 작성합니다.

- 작업 내용: 구현하거나 수정한 내용을 요약합니다.
- 스크린샷: UI 변경이 있는 경우 화면을 첨부합니다.
- 체크리스트: 리뷰 전 확인한 내용을 체크합니다.
- 참고 사항: 리뷰어가 알아야 할 내용을 작성합니다.
- 관련 이슈: `Closes #이슈번호` 형식으로 연결합니다.

### 협업 규칙

#### Branch 관련

- 하나의 브랜치에서는 하나의 기능만 개발하는 것을 권장합니다.

#### PR 관련

- 1명 이상의 리뷰 승인 후 `dev`에 Merge한다.
- 반드시 `dev` 브랜치에 merge한다. (`main` 에 바로 merge하지 않는다.)

## 🚀 실행 방법

### 패키지 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

## 📋 화면 목록 및 플로우

### 화면 목록

| 화면       | 경로          | 설명                                    |
| ---------- | ------------- | --------------------------------------- |
| Home       | `/`           | 서비스 메인 화면                        |
| Sidebar    | -             | 주요 메뉴 이동을 위한 사이드바          |
| Info       | `/info`       | 복지 정보 및 서비스 안내 화면           |
| News       | `/news`       | 관련 뉴스 목록 및 상세 정보 화면        |
| Community  | `/community`  | 사용자 간 정보 공유 및 소통 화면        |
| MyPage     | `/mypage`     | 사용자 정보 및 활동 내역 확인 화면      |
| Setting    | `/setting`    | 사용자 설정 관리 화면                   |
| Auth       | `/auth`       | 로그인 및 회원가입 화면                 |
| Onboarding | `/onboarding` | 초기 사용자 정보 입력 및 맞춤 설정 화면 |
| AI Chat    | `/ai-chat`    | AI 챗봇을 통한 맞춤형 정보 제공 화면    |

### 기본 플로우

```text
사용자 접속
  ↓
로그인 / 회원가입
  ↓
온보딩 진행
  ↓
Home 화면 진입
  ↓
Sidebar를 통해 주요 화면 이동
  ├── Info
  ├── News
  ├── Community
  ├── AI Chat
  └── MyPage / Setting
```
