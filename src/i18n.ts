export const locales = ['ko', 'en', 'ja'] as const
export type Locale = (typeof locales)[number]

const ko = {
  skip: '본문으로 이동',
  projects: '프로젝트',
  viewProjects: '프로젝트 보기',
  repository: 'GitHub 저장소',
  role: '백엔드 개발자',
  introduction: '금융 데이터 처리, 서비스 간 인증, API 연동을 중심으로 Java와 Spring 프로젝트를 정리했습니다.',
  catalogTitle: 'GitHub 프로젝트 카탈로그',
  repositories: '개 공개 저장소',
  collectionDescription: '저장소별 기술 스택과 실행 방법을 확인할 수 있습니다.',
  groups: {project: '서비스 프로젝트', lab: '백엔드 실습', algorithm: '알고리즘', starter: '초기 저장소'},
  filter: '프로젝트 분류',
  all: '전체',
  seeDetails: '상세 보기',
  closeDetails: '상세 보기 닫기',
  features: '핵심 기능',
  techStack: '기술 스택',
  structure: '프로젝트 구조',
  run: '실행과 테스트',
  mavenSetup: 'JDK 8과 Maven으로 저장소 루트에서 실행합니다.',
  postman: 'Postman 요청 예시',
  expected: '예상 응답',
  footer: '백엔드 개발 포트폴리오',
}

const messages: Partial<Record<Locale, typeof ko>> = {ko}
export const locale = locales.find((option) => option === document.documentElement.lang) ?? 'ko'
export const t = messages[locale] ?? ko
