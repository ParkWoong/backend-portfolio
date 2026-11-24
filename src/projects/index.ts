import binanceDiagram from './binance.mmd?raw'
import tokenDiagram from './token-filter.mmd?raw'

type ProjectCopy = {
  category: string
  title: string
  summary: string
  diagramSummary: string
  features: string[]
  decisions: {title: string; text: string}[]
}

export type Project = {
  id: string
  repository: string
  stack: string[]
  content: {ko: ProjectCopy; en?: ProjectCopy; ja?: ProjectCopy}
  diagrams: {ko: string; en?: string; ja?: string}
}

export const projects: readonly Project[] = [
  {
    id: 'market-stream',
    repository: 'ParkWoong/binance',
    stack: ['Java 17', 'Spring Boot', 'OkHttp', 'WebClient', 'TA4J'],
    diagrams: {ko: binanceDiagram},
    content: {ko: {
      category: '실시간 금융 데이터',
      title: 'Binance 시세 스트리밍',
      summary: 'REST로 과거 봉을 확보하고, WebSocket 마감봉을 시간대별로 평가해 Telegram 알림을 보냅니다.',
      diagramSummary: '심볼별 세션이 1시간·15분·5분봉을 관리합니다. 1시간봉은 판단 환경을 갱신하고, 15분봉은 신호를 평가하며, 5분봉 평가는 활성 상태에서 실행됩니다.',
      features: ['과거 봉 초기화와 실시간 스트리밍', '심볼·시간대별 버퍼와 지표 계산', '조건별 알림 생성과 중복 호출 방지'],
      decisions: [
        {title: '초기화와 실시간 수신 분리', text: 'REST로 계산에 필요한 과거 데이터를 채운 뒤 OkHttp WebSocket으로 이어받습니다. TA4J는 EMA, RSI, 볼린저 밴드 계산을 담당합니다.'},
        {title: '캔들 처리 범위 제한', text: '미완성 봉과 중복·역순 봉을 건너뛰고 시간대별 실시간 버퍼를 300개 이하로 유지합니다. 알림 키는 프로세스 메모리에서 관리합니다.'},
        {title: '연결 실패 후 세션 재시작', text: 'WebSocket 실패 콜백이 세션을 닫고 다시 시작합니다. 재연결 시간이나 알림 전달 성공률의 실측 자료는 공개 저장소에서 확인되지 않았습니다.'},
        {title: '최신 코드와 빌드 검증', text: '최신 커밋은 일봉·4시간봉 평가를 제거하고 5분봉 평가를 추가했습니다. 원본은 REST 서비스의 파일명과 클래스명 대소문자가 달라 컴파일에 실패했습니다. 아키텍처는 해당 커밋의 소스에 근거합니다.'},
      ],
    }},
  },
  {
    id: 'token-cache',
    repository: 'ParkWoong/spring-webclient-redis-token-filter-test',
    stack: ['Java 8', 'Spring WebFlux', 'Redis', 'OAuth2', 'JUnit'],
    diagrams: {ko: tokenDiagram},
    content: {ko: {
      category: '서비스 간 인증',
      title: 'WebClient 토큰 캐싱',
      summary: 'OAuth2 액세스 토큰을 Redis에서 재사용하고, 확보한 토큰을 WebClient 필터에서 요청에 추가합니다.',
      diagramSummary: 'Redis에 토큰이 없으면 별도의 WebClient로 발급받아 TTL과 함께 저장합니다. 조회·발급·저장 중 오류가 나면 대상 API 호출 전에 실패를 반환합니다.',
      features: ['OAuth2 client_credentials 토큰 발급', 'Reactive Redis 조회와 TTL 기반 저장', 'Bearer 헤더 적용과 오류 전파'],
      decisions: [
        {title: '인증 요청과 업무 API 호출 분리', text: 'API용 클라이언트에만 필터를 적용합니다. 별도의 인증 클라이언트가 토큰을 발급받으므로 인증 요청이 필터에 다시 진입하는 것을 피합니다.'},
        {title: '캐시 히트 시 발급 호출 생략', text: '유효한 캐시 값이 있는 경로는 인증 서버 호출을 건너뜁니다. 테스트는 이 경로를 다루며, 전체 지연시간 개선 폭은 측정 자료가 필요합니다.'},
        {title: '토큰 확보 전 실패 전파', text: '발급 실패나 Redis 저장 실패가 발생하면 대상 API를 호출하지 않습니다. 가짜 Redis와 HTTP 응답을 사용한 단위 테스트 5개를 JDK 17에서 실행해 통과를 확인했습니다.'},
        {title: 'TTL과 동시 미스의 설계 범위', text: 'TTL은 설정에서 주입하며 실제 토큰 만료 시간에 맞춰 관리해야 합니다. 동시에 캐시를 놓친 요청은 각각 토큰을 발급받을 수 있습니다.'},
      ],
    }},
  },
]
