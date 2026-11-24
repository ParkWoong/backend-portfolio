# ParkWoong 백엔드 포트폴리오

실시간 시세 스트리밍과 OAuth2 토큰 캐싱을 공개 코드로 설명하는 한국어 포트폴리오입니다. React, TypeScript, Tailwind CSS, Vite와 Mermaid를 사용합니다.

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
| 프로젝트 제목·카테고리·카드 소개 | [`src/projects/index.ts`](src/projects/index.ts)의 해당 프로젝트 `content.ko.title`, `category`, `summary` |
| 기술 스택·GitHub 저장소 링크 | 같은 파일의 `stack`, `repository` (`계정/저장소` 형식) |
| 아키텍처 설명·핵심 기능·설계와 검증 | 같은 파일의 `content.ko.diagramSummary`, `features`, `decisions` |
| Mermaid 다이어그램 | [`src/projects/binance.mmd`](src/projects/binance.mmd), [`src/projects/token-filter.mmd`](src/projects/token-filter.mmd) |
| 첫 화면 소개와 공통 문구 | [`src/i18n.ts`](src/i18n.ts)의 `ko` 문구. 표시 이름, GitHub 프로필 링크, 첫 화면의 흐름 그림은 [`src/main.tsx`](src/main.tsx)에서 수정합니다. |
| 브라우저 탭 제목과 검색용 설명 | [`index.html`](index.html)의 `<title>`과 `description` 메타 태그 |

### GitHub에서 문구 한 줄 수정하기

1. [`src/projects/index.ts`](src/projects/index.ts)를 열고 파일 편집 버튼을 누릅니다.
2. 예를 들어 토큰 프로젝트 카드의 소개를 바꾸려면 `id: 'token-cache'` 아래 `content.ko.summary`의 따옴표 안 문장을 수정합니다. 같은 프로젝트의 상세 URL을 유지하려면 `id`를 유지합니다.
3. 변경을 `main`에 커밋하거나 PR을 만들어 `main`에 병합합니다.
4. GitHub의 **Actions → Portfolio Pages**에서 성공을 확인한 뒤 [공개 사이트](https://parkwoong.github.io/backend-portfolio/)를 새로고침합니다.

### 로컬에서 미리 보기

위의 실행 명령 중 `npm ci`와 `npm run dev`로 화면을 확인합니다. 배포 전에 `npm run build`와 `npm run check:public`을 실행한 다음 변경 파일을 커밋하고 `main`에 푸시하거나 PR로 병합합니다.

### 프로젝트 추가와 번역

1. `src/projects/`에 새 `.mmd` 파일을 추가합니다. `src/projects/index.ts`의 기존 항목을 복사한 뒤 새 `id`, `repository`, `stack`, `content.ko`를 채우고, 새 `.mmd`를 `?raw`로 가져와 `diagrams.ko`에 연결합니다. 배열 순서대로 카드가 표시됩니다.
2. 코드 경로와 근거 커밋은 [`docs/repository-analysis.md`](docs/repository-analysis.md)에 기록합니다. 코드로 확인한 동작과 실제 측정 결과를 구분합니다.
3. 영어·일본어를 추가하려면 `src/i18n.ts`의 `messages`에 번역을 등록하고, 각 프로젝트의 `content.en` 또는 `content.ja`와 `diagrams.en` 또는 `diagrams.ja`를 채웁니다. `index.html`의 `lang`으로 기본 언어를 지정합니다. 번역이 없는 항목은 한국어로 표시됩니다.

## GitHub Pages

GitHub 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 설정합니다. `main`에 푸시하거나 **Portfolio Pages** 워크플로를 수동 실행하면 타입 검사, 빌드, 공개 파일 검사 후 `dist/`를 배포합니다. Vite는 상대 경로를 사용하므로 프로젝트 하위 URL에서도 실행됩니다.

공개 콘텐츠에는 공개 GitHub 핸들, 선별한 프로젝트 설명, 직접 작성한 다이어그램, 공개 소스 링크만 포함합니다. 원본 설정이나 데이터 파일을 프로젝트로 복사하지 마세요. 빌드 스캔에서 키, 이메일, 전화번호, 사설 네트워크 주소 형식을 검사합니다. 회사명과 비공개 맥락의 공개 가능 여부는 콘텐츠를 고칠 때 직접 검토하세요.
