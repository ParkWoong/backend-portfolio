import type { Project } from './types'

const auditBody = {"userId": "sample", "clientId": "sample-client", "requestUri": "/sample", "responseCode": "200"}

export const examples = [
  {
    id: 'token-cache', repository: 'spring-webclient-redis-token-filter-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring WebFlux', 'Reactive Redis', 'OAuth2', 'JUnit'],
    content: {ko: {
      title: 'WebClient 토큰 캐싱',
      summary: 'OAuth2 액세스 토큰을 Redis에서 재사용하고 WebClient 필터에서 Bearer 헤더를 적용합니다.',
      features: ['인증용 WebClient와 API용 WebClient를 분리합니다.', '캐시 미스에서 client_credentials로 발급받고 TTL로 저장합니다. 조회·발급·저장 오류가 나면 대상 API를 호출하기 전에 오류를 반환합니다.', '가짜 Redis와 HTTP 응답을 사용한 단위 테스트 5개를 JDK 17로 실행해 통과를 확인했습니다.'],
      structure: [['src/main/java/io/github/parkwoong/tokenfilter/ClientConfig.java', '인증용·API용 WebClient 구성'], ['src/main/java/io/github/parkwoong/tokenfilter/AccessTokenFilter.java', '캐시 조회와 토큰 발급·주입'], ['src/test/java/io/github/parkwoong/tokenfilter/AccessTokenFilterTest.java', '캐시 히트·미스와 요청 차단 테스트']],
      setup: '빌드 대상은 Java 8입니다. Postman 실행 전 로컬 Redis를 6379 포트에 시작합니다.',
      requests: [{name: '필터를 거친 API 호출', method: 'GET', path: '/api/token-probe', expected: 'HTTP 200, {"authorized":true}'}],
    }},
  },
  {
    repository: 'java-json-mapping-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'Jackson', 'org.json', 'JUnit'],
    content: {ko: {
      title: 'Java JSON 변환 유틸리티',
      summary: 'Java 객체와 JSON을 변환하고, JSON을 보기 좋게 출력하거나 지정 필드를 읽는 예제입니다.',
      features: ['JSON 직렬화, 들여쓰기, 문자열 필드 읽기, Map 변환을 제공합니다.', '포맷 API는 유효한 JSON을 정리해 반환하고 파싱 실패는 400으로 응답합니다.'],
      structure: [['src/main/java/io/github/parkwoong/demo/spec/util/JsonUtils.java', 'JSON 변환 유틸리티'], ['src/main/java/io/github/parkwoong/demo/JsonController.java', 'JSON 포맷 API'], ['src/test/java/io/github/parkwoong/demo/JsonUtilsTest.java', '유틸리티 동작 테스트']],
      requests: [{name: 'JSON 들여쓰기', method: 'POST', path: '/api/json/format', mediaType: 'application/json', body: {"name": "sample", "count": 2}, expected: 'HTTP 200, 들여쓰기가 적용된 JSON'}],
    }},
  },
  {
    repository: 'java-jwt-validation-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'JJWT', 'JUnit'],
    content: {ko: {
      title: 'JWT 서명·만료 검증',
      summary: 'HS256과 RSA 방식의 JWT 서명 검증 및 만료 상태 분리를 보여주는 예제입니다.',
      features: ['JJWT로 서명을 검증하고 만료 토큰은 만료 상태를 별도로 표시합니다.', '컨트롤러는 검증 상태와 subject를 응답합니다. 발급자와 대상 검증은 현재 예제의 범위 밖입니다.'],
      structure: [['src/main/java/io/github/parkwoong/demo/spec/util/TokenUtils.java', '서명 검증과 클레임 처리'], ['src/main/java/io/github/parkwoong/demo/JwtController.java', '검증 결과 응답'], ['src/test/java/io/github/parkwoong/demo/TokenUtilsTest.java', 'JWT 동작 테스트']],
      postmanNote: '저장소 README의 로컬 테스트용 JWT와 Base64URL 키로 Postman 변수 두 개를 설정합니다.',
      requests: [{name: 'HS256 테스트 토큰 검증', method: 'POST', path: '/api/jwt/validate', mediaType: 'application/json', body: {"token": "{{sampleJwt}}", "rsaPublicKey": "unused", "hs256Secret": "{{sampleHs256Secret}}"}, expected: '유효한 샘플로 요청하면 HTTP 200, {"valid":true,"subject":"sample-user"}'}],
    }},
  },
  {
    repository: 'spring-async-audit-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'Spring @Async', 'MyBatis', 'H2'],
    content: {ko: {
      title: '비동기 요청 감사 로그',
      summary: 'Spring 비동기 메서드에서 요청 메타데이터를 받아 MyBatis와 H2로 저장하는 예제입니다.',
      features: ['설정으로 저장 여부를 제어하고 요청 처리를 로그 INSERT와 분리합니다.', '비동기 저장을 기다린 뒤 H2 행을 확인하는 테스트를 포함합니다.'],
      structure: [['src/main/java/io/github/parkwoong/demo/config/AsyncConfig.java', '비동기 실행 활성화'], ['src/main/java/io/github/parkwoong/demo/service/LogService.java', '요청 로그 구성과 비동기 저장'], ['src/main/resources/schema.sql', '로컬 H2 테이블 초기화']],
      postmanNote: 'INSERT는 비동기로 실행되므로 잠시 뒤 조회하면 저장 결과를 확인할 수 있습니다.',
      requests: [{name: '샘플 감사 로그 등록', method: 'POST', path: '/api/audit', mediaType: 'application/json', body: auditBody, expected: 'HTTP 202, {"status":"accepted"}'}, {name: '저장된 행 개수 확인', method: 'GET', path: '/api/audit/count', expected: 'HTTP 200, count 필드'}],
    }},
  },
  {
    repository: 'spring-bean-validation-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'Bean Validation', 'Hibernate Validator'],
    content: {ko: {
      title: '커스텀 Bean Validation',
      summary: '문자열·숫자 허용값과 자릿수를 DTO 애너테이션으로 검증하는 실습입니다.',
      features: ['EnumString, Enum, Number 제약과 각각의 Validator를 정의합니다.', '유효값·잘못된 값·선택값·음수 경계를 테스트합니다.'],
      structure: [['src/main/java/io/github/parkwoong/example/ValidationController.java', '요청 DTO에 커스텀 제약 적용'], ['src/main/java/io/github/parkwoong/example/util/validation/', '제약 애너테이션과 검증기'], ['src/test/java/io/github/parkwoong/example/ValidationTest.java', '정상·실패·경계값 검사']],
      requests: [{name: '정상 DTO 검증', method: 'POST', path: '/api/validate', mediaType: 'application/json', body: {"state": "READY", "level": 1, "code": 42}, expected: 'HTTP 200, 입력 JSON 반환'}, {name: '범위를 벗어난 DTO 검증', method: 'POST', path: '/api/validate', mediaType: 'application/json', body: {"state": "OTHER", "level": 3, "code": 1234}, expected: 'HTTP 400'}],
    }},
  },
  {
    repository: 'spring-config-cache-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'MyBatis', 'H2', 'Java Map'],
    content: {ko: {
      title: 'DB 설정값 캐시와 갱신',
      summary: 'H2 설정 테이블을 조회해 메모리 Map으로 읽고 API로 갱신하는 예제입니다.',
      features: ['앱 기동 시 MyBatis로 설정값을 읽어 키별로 저장합니다.', '조회와 수동 갱신을 제공하며, DB에서 삭제된 키의 제거와 동시 갱신 보호는 추가 구현이 필요합니다.'],
      structure: [['src/main/java/io/github/parkwoong/demo/config/Store.java', '초기 로딩과 캐시 갱신'], ['src/main/java/io/github/parkwoong/demo/infra/', '설정 조회용 매퍼와 저장소'], ['src/main/java/io/github/parkwoong/demo/CacheController.java', '설정 조회·갱신 API']],
      requests: [{name: 'theme 설정 조회', method: 'GET', path: '/api/cache/theme', expected: 'HTTP 200, 초기 설정의 theme 값'}, {name: '캐시 새로 읽기', method: 'POST', path: '/api/cache/refresh', expected: 'HTTP 200, entries 필드'}],
    }},
  },
  {
    repository: 'spring-ehcache-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring WebFlux', 'JPA', 'Hibernate JCache', 'Ehcache', 'H2'],
    content: {ko: {
      title: 'JPA 엔티티와 Ehcache',
      summary: 'Ehcache 기반 JCache 매니저를 구성하고 Hibernate 엔티티에 읽기 전용 캐시를 적용합니다.',
      features: ['ehcache.xml에서 JCache 매니저를 구성합니다.', 'WebFlux 함수형 경로에서 지정 캐시와 키의 삭제 결과를 확인할 수 있습니다.'],
      structure: [['src/main/resources/ehcache.xml', '캐시 설정'], ['src/main/java/io/github/parkwoong/gateway/config/CacheConfig.java', 'JCache 매니저 등록'], ['src/main/java/io/github/parkwoong/gateway/handler/CacheEvictor.java', '지정 캐시 항목 삭제']],
      requests: [{name: '없는 캐시의 항목 삭제 시도', method: 'GET', path: '/cache/evict?cacheName=missing&key=sample', expected: 'HTTP 200, false'}],
    }},
  },
  {
    repository: 'spring-http-proxy-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'RestTemplate', 'JUnit'],
    content: {ko: {
      title: 'Spring MVC HTTP 리버스 프록시',
      summary: '설정에 지정된 업스트림으로 들어온 HTTP 요청을 RestTemplate으로 전달합니다.',
      features: ['요청 메서드, 경로, 쿼리, 헤더와 문자열 본문을 업스트림 요청으로 전달합니다.', '업스트림 HTTP 오류는 해당 상태와 본문을 반환합니다. 응답 헤더 전달 범위는 Content-Type입니다.'],
      structure: [['src/main/java/io/github/parkwoong/demo/controller/ProxyController.java', '업스트림 HTTP 호출과 응답 처리'], ['src/main/java/io/github/parkwoong/demo/spec/util/HttpUtils.java', '헤더와 전달 URL 생성'], ['src/test/java/io/github/parkwoong/demo/ProxyControllerTest.java', '업스트림 전달 테스트']],
      setup: 'gateway.origin이 가리키는 로컬 파일 서버를 먼저 시작합니다. 기본 샘플 포트는 9090입니다.',
      requests: [{name: '로컬 업스트림의 루트 요청', method: 'GET', path: '/', expected: '업스트림이 정상일 때 HTTP 200과 해당 서버의 본문'}],
    }},
  },
  {
    repository: 'spring-jpa-json-converter-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'Spring Data JPA', 'Jackson', 'H2'],
    content: {ko: {
      title: 'JPA Map·JSON 컬럼 변환',
      summary: 'JPA AttributeConverter를 사용해 엔티티의 Map 필드를 JSON 문자열로 저장하고 복원합니다.',
      features: ['엔티티의 기본 쿼리와 헤더 필드에 @Convert를 적용합니다.', 'H2에 저장한 뒤 조회해 두 Map 값이 복원되는지 확인하는 테스트를 포함합니다.'],
      structure: [['src/main/java/io/github/parkwoong/gateway/config/HashMapConverter.java', 'JSON과 Map 변환'], ['src/main/java/io/github/parkwoong/gateway/backend/', '엔티티와 JPA 저장소'], ['src/main/java/io/github/parkwoong/gateway/BackendController.java', '샘플 엔티티 저장·조회 API']],
      requests: [{name: 'Map을 포함한 샘플 저장', method: 'POST', path: '/api/backends', mediaType: 'application/json', body: {"pattern": "sample", "url": "http://localhost:9090", "pathUrl": true, "defaultQueries": {"page": 1}, "defaultHeaders": {"X-Sample": "yes"}}, expected: 'HTTP 200, 저장된 엔티티'}, {name: 'Map이 복원된 샘플 조회', method: 'GET', path: '/api/backends/sample', expected: 'HTTP 200, defaultQueries와 defaultHeaders 필드'}],
    }},
  },
  {
    repository: 'spring-mvc-body-filter-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'Servlet Filter', 'JUnit'],
    content: {ko: {
      title: 'Spring MVC 요청·응답 본문 필터',
      summary: '필터에서 본문을 읽은 뒤 컨트롤러와 클라이언트가 다시 읽을 수 있도록 복원합니다.',
      features: ['요청 래퍼가 캐시한 바이트를 컨트롤러에 다시 제공합니다.', '응답 래퍼에서 읽은 본문을 클라이언트 응답으로 복사합니다.'],
      structure: [['src/main/java/io/github/parkwoong/example/filter/', '요청·응답 래퍼와 필터'], ['src/main/java/io/github/parkwoong/example/EchoController.java', '본문이 유지되는지 확인하는 에코 API'], ['src/test/java/io/github/parkwoong/example/BodyFilterTest.java', '본문 전달 테스트']],
      requests: [{name: '본문을 필터를 거쳐 왕복', method: 'POST', path: '/echo', mediaType: 'text/plain', body: 'hello', expected: 'HTTP 200, hello 텍스트'}],
    }},
  },
  {
    repository: 'spring-mvc-exception-handler-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'ControllerAdvice', 'Bean Validation'],
    content: {ko: {
      title: 'Spring MVC 공통 예외 응답',
      summary: '입력 검증, 요청 오류, 서버 예외를 공통 JSON 오류 형식으로 매핑합니다.',
      features: ['ControllerAdvice가 예외별 HTTP 상태, 오류 코드, 메시지를 결정합니다.', '예상하지 못한 예외의 응답에는 공통 메시지를 사용합니다.'],
      structure: [['src/main/java/io/github/parkwoong/example/exception/AdviceController.java', '예외 종류별 응답 매핑'], ['src/main/java/io/github/parkwoong/example/exception/error/', '오류 유형, 코드, 응답 객체'], ['src/main/java/io/github/parkwoong/example/SampleController.java', '요청·서버 오류 샘플']],
      requests: [{name: '요청 오류 응답', method: 'GET', path: '/sample/bad', expected: 'HTTP 400, errorCode API400'}, {name: '서버 오류 응답', method: 'GET', path: '/sample/fail', expected: 'HTTP 500, errorCode API500'}],
    }},
  },
  {
    repository: 'spring-mybatis-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'MyBatis', 'H2', 'JUnit'],
    content: {ko: {
      title: 'MyBatis 라우트 조회와 로그 INSERT',
      summary: 'MyBatis 매퍼로 샘플 라우트를 조회하고 요청 로그를 H2에 저장하는 예제입니다.',
      features: ['라우트 SELECT와 요청 로그 INSERT를 매퍼 및 저장소로 분리합니다.', 'schema.sql이 테이블과 샘플 라우트를 초기화합니다.'],
      structure: [['src/main/java/io/github/parkwoong/demo/infra/mapper/', '어노테이션 기반 SELECT와 INSERT'], ['src/main/java/io/github/parkwoong/demo/infra/repository/', '매퍼 호출과 로그 ID 부여'], ['src/main/resources/schema.sql', '로컬 테이블과 샘플 데이터']],
      requests: [{name: '샘플 라우트 조회', method: 'GET', path: '/api/routes', expected: 'HTTP 200, 샘플 라우트 배열'}, {name: '요청 로그 한 건 저장', method: 'POST', path: '/api/request-logs', mediaType: 'application/json', body: auditBody, expected: 'HTTP 200, {"inserted":1}'}],
    }},
  },
  {
    repository: 'spring-oauth2-token-request-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring MVC', 'HTTP Basic', 'OAuth2', 'JUnit'],
    content: {ko: {
      title: 'OAuth2 토큰 요청 폼 구성',
      summary: 'Basic 인증 헤더를 파싱하고 authorization_code 요청을 URL 인코딩 폼으로 구성합니다.',
      features: ['누락되거나 형식이 잘못된 Basic 헤더를 구분합니다.', '인가 코드와 클라이언트 정보를 인코딩하고 미리보기 응답에서 시크릿을 마스킹합니다.'],
      structure: [['src/main/java/io/github/parkwoong/oauth/HttpUtils.java', 'HTTP Basic 헤더 파싱'], ['src/main/java/io/github/parkwoong/oauth/AuthorizationCodeForm.java', '토큰 요청 폼 인코딩'], ['src/main/java/io/github/parkwoong/oauth/TokenRequestController.java', '헤더 검사와 폼 미리보기 API']],
      requests: [{name: 'Basic 헤더 확인', method: 'POST', path: '/api/oauth/basic', auth: 'Basic Auth에 사용자 이름 sample, 테스트용 비밀번호 example을 입력합니다.', expected: 'HTTP 200, clientId와 secretPresent 필드'}, {name: '인가 코드 폼 미리보기', method: 'POST', path: '/api/oauth/form', mediaType: 'application/json', body: {"code": "abc", "clientId": "sample", "clientSecret": "example", "redirectUri": "http://localhost/callback"}, expected: 'HTTP 200, client_secret이 REDACTED로 표시된 폼'}],
    }},
  },
  {
    repository: 'spring-webflux-error-handler-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring WebFlux', 'Reactor', 'JUnit'],
    content: {ko: {
      title: 'Spring WebFlux 공통 오류 응답',
      summary: '함수형 WebFlux 라우트에서 발생하는 예외를 HTTP 상태와 간단한 JSON으로 변환합니다.',
      features: ['커스텀 예외 핸들러가 오류 이름과 메시지를 공통 필드에 담습니다.', '샘플 오류 라우트와 응답 검증 테스트를 포함합니다.'],
      structure: [['src/main/java/io/github/parkwoong/webflux/error/component/CustomWebExceptionHandler.java', '상태와 오류 JSON 구성'], ['src/main/java/io/github/parkwoong/webflux/handler/SampleHandler.java', '샘플 오류 발생 경로'], ['src/test/java/io/github/parkwoong/webflux/ErrorHandlerTest.java', '오류 응답 테스트']],
      requests: [{name: '샘플 HTTP 오류 조회', method: 'GET', path: '/sample/error', expected: 'HTTP 400, error와 message 필드'}],
    }},
  },
  {
    repository: 'spring-webflux-filter-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring WebFlux', 'Reactor', 'Spring Data JPA', 'H2'],
    content: {ko: {
      title: 'WebFlux 요청 추적과 기록 필터',
      summary: '요청 ID를 부여하고 본문을 재사용하며, 마스킹된 HTTP 메타데이터를 H2에 기록합니다.',
      features: ['RequestDecorator가 요청을 추적할 ID를 추가합니다.', 'HistoryLogger가 본문을 읽고 다시 제공하며 응답을 감쌉니다. 저장용 헤더와 본문은 마스킹합니다.'],
      structure: [['src/main/java/io/github/parkwoong/gateway/filter/', '요청 장식과 기록 필터'], ['src/main/java/io/github/parkwoong/gateway/history/', '기록 엔티티와 저장소'], ['src/test/java/io/github/parkwoong/gateway/FilterTest.java', '샘플 필터 테스트']],
      requests: [{name: '추적 필터를 거쳐 에코 호출', method: 'POST', path: '/sample', mediaType: 'text/plain', body: 'hello', expected: 'HTTP 200, hello 텍스트'}],
    }},
  },
  {
    repository: 'spring-webflux-proxy-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring WebFlux', 'WebClient', 'Spring Data JPA', 'H2'],
    content: {ko: {
      title: 'Spring WebFlux 라우팅 프록시',
      summary: 'H2에서 등록된 목적지를 찾아 WebClient로 메서드·쿼리·헤더·바이트 본문을 전달합니다.',
      features: ['함수형 라우터와 업스트림 전달 핸들러를 분리합니다.', 'WebClient에 연결 및 응답 타임아웃을 설정합니다.'],
      structure: [['src/main/java/io/github/parkwoong/gateway/router/Router.java', '함수형 요청 라우팅'], ['src/main/java/io/github/parkwoong/gateway/handler/IngressHandler.java', '대상 조회와 HTTP 요청 전달'], ['src/main/java/io/github/parkwoong/gateway/config/WebClientConfig.java', 'HTTP 타임아웃 설정']],
      setup: '샘플 경로가 가리키는 로컬 업스트림을 9090 포트에 준비합니다.',
      requests: [{name: '등록된 로컬 업스트림 호출', method: 'GET', path: '/sample', expected: '업스트림이 정상일 때 HTTP 200과 해당 서버의 응답 본문'}],
    }},
  },
  {
    repository: 'spring-webflux-sftp-test', group: 'lab', build: 'maven',
    stack: ['Java 8', 'Spring WebFlux', 'Reactor', 'JSch', 'SFTP'],
    content: {ko: {
      title: 'WebFlux SFTP 업로드·다운로드',
      summary: 'Base64 요청·응답과 JSch를 연결해 SFTP 파일 송수신을 실습합니다.',
      features: ['블로킹 SFTP 작업을 boundedElastic에서 실행하고 요청이 끝나면 채널과 세션을 정리합니다.', 'known_hosts 검증과 파일명 검사를 거쳐 설정된 원격 디렉터리를 사용합니다.'],
      structure: [['src/main/java/io/github/parkwoong/sftp/sftp/handler/', '파일 업로드와 다운로드 핸들러'], ['src/main/java/io/github/parkwoong/sftp/sftp/config/JschSessionHolder.java', 'SFTP 연결과 호스트 검증'], ['src/test/java/io/github/parkwoong/sftp/SftpPathTest.java', '원격 파일 경로 테스트']],
      setup: '로컬 테스트용 SFTP 서버와 알려진 호스트 파일을 준비하고 README의 환경 변수에 연결 정보를 설정합니다.',
      requests: [{name: '샘플 파일 업로드', method: 'POST', path: '/sftp/upload', mediaType: 'application/json', body: {"name": "hello.txt", "payload": "aGVsbG8="}, expected: 'HTTP 200, result가 true이고 설정된 원격 파일 경로 반환'}, {name: '샘플 파일 다운로드', method: 'POST', path: '/sftp/download', mediaType: 'application/json', body: {"name": "hello.txt"}, expected: 'HTTP 200, 앞에서 저장한 Base64 본문 반환'}],
    }},
  },
] satisfies Project[]
