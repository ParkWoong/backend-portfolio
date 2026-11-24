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

## 프로젝트 추가와 번역

1. `src/projects/`에 `.mmd` 파일을 추가하고 `src/projects/index.ts`의 `projects` 배열에 소개, 설계와 검증 내용, 기술 스택, 커밋에 고정한 근거를 등록합니다.
2. 분석과 근거 기록은 `docs/repository-analysis.md`에 업데이트합니다. 코드로 확인한 동작과 실제 측정 결과를 구분합니다.
3. 영어·일본어 버전을 추가할 때 `src/i18n.ts`에 화면 문구를 등록하고 프로젝트 데이터의 `content.en` 또는 `content.ja`에 번역을 등록합니다. 번역된 `.mmd`를 해당 `diagrams` 키에 연결하세요. `index.html`의 `lang`으로 기본 표시 언어를 지정할 수 있습니다. 번역이 없는 항목은 한국어로 표시합니다.

## GitHub Pages

GitHub 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 설정합니다. `main`에 푸시하거나 **Portfolio Pages** 워크플로를 수동 실행하면 타입 검사, 빌드, 공개 파일 검사 후 `dist/`를 배포합니다. Vite는 상대 경로를 사용하므로 프로젝트 하위 URL에서도 실행됩니다.

공개 콘텐츠에는 공개 GitHub 핸들, 선별한 프로젝트 설명, 직접 작성한 다이어그램, 공개 소스 링크만 포함합니다. 원본 설정이나 데이터 파일을 프로젝트로 복사하지 마세요. 빌드 스캔에서 키, 이메일, 전화번호, 사설 네트워크 주소 형식을 검사합니다. 회사명과 비공개 맥락의 공개 가능 여부는 콘텐츠를 고칠 때 직접 검토하세요.
