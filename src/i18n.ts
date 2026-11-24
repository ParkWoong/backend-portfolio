export const locales = ['ko', 'en', 'ja'] as const
export type Locale = (typeof locales)[number]

const ko = {
  skip: '본문으로 이동',
  projects: '프로젝트',
  projectDetails: '프로젝트 상세',
  viewProjects: '프로젝트 보기',
  repository: 'GitHub 저장소',
  role: '백엔드 개발자',
  introduction: '실시간 금융 데이터의 수신부터 서비스 간 인증까지, Java와 Spring으로 구현한 백엔드 프로젝트를 소개합니다.',
  selectedWork: '대표 프로젝트',
  selectedDescription: '실시간 처리와 인증을 실제 코드로 살펴봅니다.',
  seeDetails: '상세 보기',
  architecture: '아키텍처',
  design: '설계와 검증',
  evidence: '코드 근거',
  evidenceDescription: '분석에 사용한 파일과 커밋입니다.',
  mermaidSource: '다이어그램 원본',
  loading: '다이어그램을 불러오는 중입니다.',
  diagramError: '다이어그램을 표시할 수 없습니다. 아래 원본을 확인할 수 있습니다.',
  features: '핵심 기능',
  flowTitle: '시세 스트리밍 처리 흐름',
  flowSource: '초기 데이터 · 마감봉',
  flowSession: '심볼·시간대별 상태',
  flowAlert: '조건 충족 시 알림',
  footer: '백엔드 개발 포트폴리오',
}

const messages: Partial<Record<Locale, typeof ko>> = {ko}
export const locale = locales.find((option) => option === document.documentElement.lang) ?? 'ko'
export const t = messages[locale] ?? ko
