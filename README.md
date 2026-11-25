# ParkWoong 백엔드 포트폴리오

ParkWoong의 공개 저장소를 소개하는 한국어 백엔드 포트폴리오입니다. React, TypeScript, Tailwind CSS, Vite를 사용합니다. 상세 화면에는 프로젝트 구조, 기술 스택, 실행 방법, 로컬 Postman 요청 예시를 담습니다.

## 실행

Node.js 24에서 다음 명령을 실행합니다.

```sh
npm ci
npm run dev
npm run build
npm run check:public
npm run preview
```

## 사이트 데이터 수정 매뉴얼

사이트는 아래 파일의 데이터를 빌드할 때 읽습니다. GitHub에서 파일을 직접 편집하거나 로컬에서 수정할 수 있습니다.

| 바꿀 내용 | 수정할 파일과 항목 |
| --- | --- |
| 프로젝트 제목·카드 소개·분류 | [`src/projects/index.ts`](src/projects/index.ts) 또는 [`src/projects/examples.ts`](src/projects/examples.ts)에서 `repository` 이름으로 찾습니다. `content.ko.title`, `content.ko.summary`, `group`을 수정합니다. |
| 기술 스택·GitHub 저장소 링크 | 해당 항목의 `stack`, `repository`를 수정합니다. `repository`에는 계정명 없이 저장소 이름을 입력합니다. |
| 프로젝트 구조·핵심 기능 | `content.ko.structure`의 `[경로, 설명]` 목록과 `features`를 수정합니다. |
| 실행 환경과 Postman 예시 | `build` 또는 `commands`, `directory`, `port`, `content.ko.setup`, `requests`, `postmanNote`를 수정합니다. `requests`에는 메서드, 경로, 예상 응답과 필요한 본문을 등록합니다. JSON 본문은 객체, 일반 텍스트는 문자열로 입력합니다. |
| 첫 화면 소개와 공통 문구 | [`src/i18n.ts`](src/i18n.ts)의 `ko` 문구. 표시 이름과 GitHub 프로필 링크는 [`src/main.tsx`](src/main.tsx)에서 수정합니다. |
| 브라우저 탭 제목과 검색용 설명 | [`index.html`](index.html)의 `<title>`과 `description` 메타 태그 |

### GitHub에서 문구 한 줄 수정하기

1. [`src/projects/examples.ts`](src/projects/examples.ts)를 열고 파일 편집 버튼을 누릅니다.
2. 예를 들어 토큰 프로젝트 카드의 소개를 바꾸려면 `id: 'token-cache'` 아래 `content.ko.summary`의 따옴표 안 문장을 수정합니다. 상세 URL은 `id`가 있으면 `id`, 그 외에는 `repository`를 사용합니다.
3. 변경을 `main`에 커밋하거나 PR을 만들어 `main`에 병합합니다.
4. GitHub의 **Actions → Portfolio Pages**에서 성공을 확인한 뒤 [공개 사이트](https://parkwoong.github.io/backend-portfolio/)를 새로고침합니다.

### 로컬에서 미리 보기

위의 실행 명령 중 `npm ci`와 `npm run dev`로 화면을 확인합니다. 배포 전에 `npm run build`와 `npm run check:public`을 실행한 다음 변경 파일을 커밋하고 `main`에 푸시하거나 PR로 병합합니다.

### 프로젝트 추가와 번역

1. `src/projects/index.ts` 또는 `src/projects/examples.ts`의 항목을 복사해 고유한 `repository`, `group`, `stack`, `content.ko`를 채웁니다. 배열 순서대로 카드가 표시됩니다.
2. 분석 기준 커밋을 [`docs/repository-analysis.md`](docs/repository-analysis.md)에 기록합니다. Postman 예시는 공개 컨트롤러, 로컬 설정, 테스트에서 확인 가능한 경로에 샘플 데이터만 사용합니다.
3. 영어·일본어를 추가하려면 `src/i18n.ts`의 `messages`에 번역을 등록하고, 각 프로젝트의 `content.en` 또는 `content.ja`를 채웁니다. `index.html`의 `lang`으로 기본 언어를 지정합니다. 번역이 없는 항목은 한국어로 표시됩니다.

## GitHub Pages

GitHub 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 설정합니다. `main`에 푸시하거나 **Portfolio Pages** 워크플로를 수동 실행하면 타입 검사, 빌드, 공개 파일 검사 후 `dist/`를 배포합니다. Vite는 상대 경로를 사용하므로 프로젝트 하위 URL에서도 실행됩니다.

공개 콘텐츠에는 공개 GitHub 핸들, 프로젝트 설명, 공개 저장소 링크, 로컬 샘플 요청만 포함합니다. 빌드 스캔에서 키, 이메일, 전화번호, 사설 네트워크 주소 형식을 검사합니다. 실제 자격 증명, 개인정보, 회사 관련 비공개 정보의 공개 여부는 편집 단계에서 확인하세요.
