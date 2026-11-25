import { examples } from './examples'
import type { Project } from './types'

export { projectGroups, type Project, type ProjectGroup } from './types'

export const projects: readonly Project[] = [
  {
    id: 'market-stream', repository: 'binance', group: 'project', build: 'wrapper',
    stack: ['Java 17', 'Spring Boot 3.5.6', 'OkHttp', 'WebClient', 'TA4J'],
    content: {ko: {
      title: 'Binance 시세 스트리밍',
      summary: 'REST로 과거 봉을 확보하고 WebSocket 마감봉을 평가해 Telegram 알림을 보내는 시세 처리 실험입니다.',
      features: ['심볼별로 1시간·15분·5분봉을 관리하고 미완성, 중복, 역순 이벤트를 건너뜁니다.', '실시간 버퍼를 시간대별 300개 이하로 유지하고 TA4J로 EMA, RSI, 볼린저 밴드를 계산합니다.', '신호 키를 메모리에 기록해 동일 키의 알림 호출을 중복 실행하지 않습니다.'],
      structure: [
        ['src/main/java/com/example/binance/service/', 'REST 초기화, WebSocket 수신, 캔들 평가와 지표 계산'],
        ['src/main/java/com/example/binance/ws/SymbolSession.java', '심볼별 연결과 시간대별 버퍼 상태'],
        ['src/main/java/com/example/binance/controller/BinanceScanController.java', '세션 조회 및 로컬 제어 API'],
        ['src/main/java/com/example/binance/utils/Notifier.java', 'Telegram 알림 전송'],
      ],
      setup: 'JDK 17을 사용합니다. 원본의 REST 서비스 파일명과 클래스명 대소문자가 달라 컴파일 실패가 재현되었습니다. 기동 검증에는 해당 오류 수정과 외부 연동 설정이 필요합니다.',
      requests: [{name: '심볼별 세션 상태 읽기', method: 'GET', path: '/session/state', expected: '세션 상태를 담은 텍스트 응답. 애플리케이션 기동 후 확인할 수 있습니다.'}],
    }},
  },
  {
    repository: 'upbit', group: 'project', build: 'wrapper',
    stack: ['Java 17', 'Spring Boot', 'WebClient', 'JJWT', 'Spring Data JPA', 'H2'],
    content: {ko: {
      title: 'Upbit API 연동 실험',
      summary: '시장 데이터 조회, JWT 요청 인증, 주문 응답과 거래 이력 저장을 연결한 거래소 API 실험입니다.',
      features: ['시장, 캔들, 호가 데이터를 바탕으로 후보를 조회하는 경로를 제공합니다.', '인증 요청에서 WebClient 필터가 요청 데이터를 바탕으로 JWT를 구성합니다.', '주문 요청과 거래 이력 저장, 거래 중지 이벤트를 각각 서비스로 분리합니다.'],
      structure: [
        ['src/main/java/com/example/upbit/controller/', '시장 조회와 거래 제어 API'],
        ['src/main/java/com/example/upbit/service/', '시장 데이터 평가, 주문 연동, 중지 이벤트'],
        ['src/main/java/com/example/upbit/config/TokenFilterFunction.java', 'WebClient 요청 인증 필터'],
        ['src/main/java/com/example/upbit/history/', '거래 이력 엔티티와 저장소'],
      ],
      setup: 'JDK 17을 사용합니다. 외부 API와 알림 설정은 로컬 환경에서 구성합니다. 원본의 실거래 호출과 성과 수치는 확인 범위에 포함되지 않았습니다.',
      postmanNote: '아래 요청은 로컬 테스트 컨트롤러의 본문 수신 예시입니다.',
      requests: [{name: '샘플 요청 본문 수신', method: 'POST', path: '/requestBodyTest', mediaType: 'application/json', body: {"message": "sample"}, expected: '본문을 받은 뒤 TRUE 텍스트를 반환합니다.'}],
    }},
  },
  {
    repository: 'byPassWebFlux', group: 'lab', build: 'wrapper', directory: 'webflux', port: 8081,
    stack: ['Java 17', 'Spring Boot', 'Spring WebFlux', 'WebClient'],
    content: {ko: {
      title: 'WebFlux 로컬 요청 전달',
      summary: '함수형 라우터에서 받은 POST 요청을 WebClient로 로컬 미러 엔드포인트에 전달하는 실습입니다.',
      features: ['RouterFunction이 전달 경로와 본문 에코 경로를 각각 등록합니다.', 'WebClient가 요청 헤더와 바이트 본문을 로컬 미러로 보냅니다.'],
      structure: [
        ['webflux/src/main/java/com/woong/webflux/config/RouterConfig.java', 'POST 라우트 등록'],
        ['webflux/src/main/java/com/woong/webflux/handler/', '요청 전달과 미러 응답 처리'],
        ['webflux/src/main/java/com/woong/webflux/publisher/WebClientPublisher.java', '로컬 미러 HTTP 호출'],
      ],
      setup: 'JDK 17로 webflux 디렉터리에서 실행합니다. 로컬 서버 포트는 8081입니다.',
      requests: [{name: '미러에 본문 보내기', method: 'POST', path: '/mirror', mediaType: 'text/plain', body: 'hello', expected: 'HTTP 200, hello 텍스트'}],
    }},
  },
  {
    repository: 'separate_connection_pool', group: 'lab', build: 'wrapper', directory: 'connection_pool',
    stack: ['Java 17', 'Spring Boot', 'MyBatis', 'HikariCP', 'MySQL'],
    content: {ko: {
      title: '업무·로그 DB 커넥션 풀 분리',
      summary: '업무 조회와 로그 적재에 각각 HikariCP 데이터소스와 MyBatis 세션을 연결하는 실습입니다.',
      features: ['업무용과 로그용 DataSource, SqlSessionFactory, SqlSessionTemplate을 각각 정의합니다.', '패키지별 MapperScan으로 조회 및 로그 SQL이 해당 풀을 사용하도록 구성합니다.'],
      structure: [
        ['connection_pool/src/main/java/com/example/connection_pool/config/BatisConfig.java', '데이터소스와 MyBatis 세션 구성'],
        ['connection_pool/src/main/java/com/example/connection_pool/service/TestService.java', '조회, 로그 적재 및 풀 식별'],
        ['connection_pool/src/main/resources/mybatis/', '업무 조회와 로그 INSERT 매퍼 XML'],
      ],
      setup: 'JDK 17과 로컬 MySQL을 사용합니다. 매퍼 XML이 기대하는 테이블과 업무·로그 풀 설정을 직접 구성해야 합니다.',
      requests: [{name: '샘플 행 조회', method: 'GET', path: '/data/1', expected: '테스트 DB에 ID 1의 행을 준비한 뒤 조회 결과를 확인합니다.'}],
    }},
  },
  ...examples,
  {
    repository: 'coading_test', group: 'algorithm', commands: ['javac Back2178.java', 'java Back2178'],
    stack: ['Java', 'BFS', 'Union-Find', '이진 탐색'],
    content: {ko: {
      title: 'Java 알고리즘 풀이',
      summary: '백준 문제의 그래프 탐색, 자료구조, 탐색 알고리즘을 Java로 구현한 풀이 모음입니다.',
      features: ['파일별 main 메서드에서 표준 입력을 처리합니다.', 'BFS, 서로소 집합, 정렬 후 이진 탐색 등 문제별 접근을 비교할 수 있습니다.'],
      structure: [['Back2178.java', '미로를 너비 우선 탐색'], ['Back1717.java', '서로소 집합의 합치기와 조회'], ['Back1920.java', '정렬과 수 찾기']],
      setup: 'JDK에서 개별 Java 파일을 컴파일하고 해당 문제의 입력을 표준 입력으로 전달합니다.',
      postmanNote: '표준 입력과 출력으로 실행하는 CLI 풀이입니다.',
    }},
  },
  {
    repository: 'sideJob', group: 'starter', build: 'wrapper', directory: 'woong',
    stack: ['Java 17', 'Spring Boot', 'WebClient', 'Selenium', 'Jsoup'],
    content: {ko: {
      title: '웹 콘텐츠 수집 실험 초안',
      summary: 'WebClient HTTP 호출과 Selenium 페이지 로딩을 실험하기 위한 Spring Boot 초기 코드입니다.',
      features: ['외부 HTTP 호출용 서비스와 브라우저 드라이버 설정을 분리합니다.', '동적 페이지 로딩 메서드와 콘텐츠 서비스의 호출 골격이 있습니다. 수집 결과 반환은 미완성입니다.'],
      structure: [['woong/src/main/java/com/example/woong/config/', 'WebClient와 Selenium 설정'], ['woong/src/main/java/com/example/woong/service/', '동적 페이지 수집 골격과 HTTP 호출 서비스'], ['woong/pom.xml', 'Maven 설정과 의존성']],
      setup: 'JDK 17로 woong 디렉터리에서 빌드합니다. 브라우저 연동은 로컬 드라이버 환경을 필요로 합니다.',
      postmanNote: '현재 검토한 커밋은 호출 가능한 애플리케이션 API를 정의하기 전 단계입니다.',
    }},
  },
  {
    repository: 'test_webflux', group: 'starter', build: 'wrapper',
    stack: ['Java 17', 'Spring Boot', 'Spring WebFlux', 'MyBatis', 'H2'],
    content: {ko: {
      title: 'Spring WebFlux 초기 프로젝트',
      summary: 'WebFlux·MyBatis·H2 의존성과 컨텍스트 테스트를 갖춘 Spring Boot 시작 구조입니다.',
      features: ['메인 애플리케이션 클래스와 Maven Wrapper를 포함합니다.', '스프링 컨텍스트 로딩 테스트 파일을 제공합니다.'],
      structure: [['src/main/java/com/woong/webflux/WebfluxApplication.java', 'Spring Boot 진입점'], ['src/test/java/com/woong/webflux/WebfluxApplicationTests.java', '컨텍스트 초기화 테스트'], ['pom.xml', 'WebFlux, MyBatis, H2 의존성']],
      setup: 'JDK 17 환경에서 Maven Wrapper로 실행합니다.',
      postmanNote: '현재 소스는 초기 애플리케이션과 테스트를 담고 있으며 HTTP 라우트 선언은 확인되지 않았습니다.',
    }},
  },
  {
    repository: 'webflux_sftp_server', group: 'starter', stack: [],
    content: {ko: {
      title: 'WebFlux SFTP 서버 저장소',
      summary: '초기 README를 등록한 저장소입니다. 구현 코드를 갖춘 SFTP 업로드·다운로드 예제는 별도 프로젝트에서 볼 수 있습니다.',
      features: [],
      structure: [['README.md', '저장소 이름을 기록한 초기 문서']],
      setup: '현재 커밋에서 실행 가능한 소스와 빌드 파일을 확인할 수 없습니다.',
      postmanNote: 'HTTP 요청 예시는 구현된 WebFlux SFTP 업로드·다운로드 프로젝트에서 볼 수 있습니다.',
    }},
  },
]
