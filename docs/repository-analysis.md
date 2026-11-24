# 공개 저장소 분석

2026-11-24 기준 GitHub 계정 `ParkWoong`의 공개 저장소 25개를 목록과 메타데이터로 살폈다. 그중 `binance`, `upbit`, `byPassWebFlux`, `separate_connection_pool`, `spring-async-audit-test`, `spring-webclient-redis-token-filter-test`의 README 존재 여부와 내용 또는 주요 커밋을 확인했다. 대표 두 프로젝트의 소스, Maven 설정, 애플리케이션 설정, 테스트, 커밋 이력을 상세 분석했다.

`binance`는 실시간 외부 데이터 수신과 시간대별 상태 관리를, `spring-webclient-redis-token-filter-test`는 서비스 간 인증과 캐시 실패 처리, 테스트 설계를 보여준다. 두 예제를 함께 배치해 금융 데이터를 다루는 흐름과 인증 경계에서의 동작을 검토할 수 있게 했다.

## Binance 시세 스트리밍과 알림

**분석 기준** [`6902b13`](https://github.com/ParkWoong/binance/commit/6902b13e0735502c8c8342ffa7657f432f0e7a28)

| 항목 | 코드 근거와 해석 |
| --- | --- |
| 목적과 기술 | Binance Futures 봉 데이터를 읽고 조건에 맞는 알림을 Telegram으로 전송하는 개인 실험 프로젝트. Java 17, Spring Boot 3.5.6, WebClient, OkHttp, TA4J를 사용한다. [README](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/README.md), [pom.xml](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/pom.xml#L29-L91) |
| 초기화 | 앱 준비 이벤트가 설정에 바인딩된 심볼을 읽어 세션을 시작한다. REST로 1시간·15분·5분봉을 초기화한 뒤 OkHttp WebSocket을 연다. REST는 초기 지표 계산에 필요한 과거 데이터를, WebSocket은 이후 실시간 변경을 제공한다. [ScheduledConfig.java](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/src/main/java/com/example/binance/config/ScheduledConfig.java#L16-L25), [KlineSocketService.java](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/src/main/java/com/example/binance/service/KlineSocketService.java#L42-L89) |
| 상태와 계산 | 마감봉만 처리하고 직전 봉과 마감 시간이 같거나 더 오래된 봉을 건너뛴다. 시간대별 실시간 버퍼를 300개 이하로 유지한다. 1시간봉으로 판단 환경을 갱신하고 15분봉으로 조건을 평가한다. 활성 상태에서 5분봉을 추가로 평가한다. TA4J로 EMA, RSI, 볼린저 밴드를 계산한다. [KlineSocketService.java](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/src/main/java/com/example/binance/service/KlineSocketService.java#L87-L142), [IndicatorService.java](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/src/main/java/com/example/binance/service/IndicatorService.java#L59-L89) |
| 알림과 복구 | 신호 키를 프로세스 메모리에 기록해 같은 키의 알림 호출을 중복 실행하지 않는다. WebSocket 실패 콜백에서 세션을 닫고 다시 시작한다. 재연결 대기 시간과 알림 전달 성공률에 대한 검증 자료는 확인되지 않았다. [CalculateService.java](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/src/main/java/com/example/binance/service/CalculateService.java#L361-L381), [KlineSocketService.java](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/src/main/java/com/example/binance/service/KlineSocketService.java#L149-L160), [Notifier.java](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/src/main/java/com/example/binance/utils/Notifier.java#L18-L34) |
| 변경 이력 | [`09b347d`](https://github.com/ParkWoong/binance/commit/09b347da99ece80cc955df92342469813a4eaa97)에서 초기 데이터와 세션 처리 흐름을 도입했고, [`6902b13`](https://github.com/ParkWoong/binance/commit/6902b13e0735502c8c8342ffa7657f432f0e7a28)에서 일봉·4시간봉 평가를 걷어내고 5분봉 평가를 추가했다. README와 최신 구현이 달라 다이어그램은 최신 코드를 기준으로 작성했다. |

Spring Boot의 설정 바인딩으로 심볼과 연결 설정을 주입한다. REST와 스트리밍을 분리하면 초기 상태를 채워 연속 입력을 처리할 수 있고, 캔들 버퍼 상한은 저장하는 봉의 개수를 제한한다. 두 효과는 코드에서 확인할 수 있으며 메모리나 지연시간 개선율은 측정 자료가 필요하다. `sentKeys`는 별도의 상한이 없으므로 봉 버퍼가 제한된다는 사실을 전체 메모리 사용량에 적용할 수 없다. 원본 저장소는 컨텍스트 로딩 테스트를 포함한다. 외부 거래소나 Telegram에는 접속하거나 알림을 발송하지 않았다.

JDK 17에서 원본을 컴파일했을 때 공개 클래스명 `BinanceRestService`와 [파일명 `BInanceRestService.java`](https://github.com/ParkWoong/binance/blob/6902b13e0735502c8c8342ffa7657f432f0e7a28/src/main/java/com/example/binance/service/BInanceRestService.java#L22)의 대소문자 불일치를 재현했다. 위 아키텍처는 해당 커밋의 소스 기반 분석이다.

## WebClient OAuth2 토큰 캐싱

**분석 기준** [`5418ab5`](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/commit/5418ab565ea7f9207dc2a7e9a17faa7ea70a4b01)

| 항목 | 코드 근거와 해석 |
| --- | --- |
| 목적과 기술 | 서비스 간 OAuth2 `client_credentials` 호출을 재사용 가능한 요청 필터로 보여주는 예제. Java 8, Spring Boot 2.6.6, Spring WebFlux, Reactive Redis를 사용한다. [README](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/blob/5418ab565ea7f9207dc2a7e9a17faa7ea70a4b01/README.md), [pom.xml](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/blob/5418ab565ea7f9207dc2a7e9a17faa7ea70a4b01/pom.xml#L6-L31) |
| 요청 구조 | 샘플 컨트롤러는 필터가 달린 API용 WebClient를 호출한다. 토큰 발급용 WebClient에는 필터를 적용하지 않아 발급 요청 자체가 토큰 발급을 다시 호출하지 않는다. [TokenProbeController.java](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/blob/5418ab565ea7f9207dc2a7e9a17faa7ea70a4b01/src/main/java/io/github/parkwoong/tokenfilter/TokenProbeController.java#L20-L45), [ClientConfig.java](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/blob/5418ab565ea7f9207dc2a7e9a17faa7ea70a4b01/src/main/java/io/github/parkwoong/tokenfilter/ClientConfig.java#L15-L42) |
| 캐시 및 실패 경로 | Redis를 먼저 조회한다. 미스이면 토큰을 발급받아 설정된 TTL로 저장하고, 확보한 토큰을 Bearer 헤더에 추가한다. 조회 오류, 발급 실패, 빈 토큰, 저장 실패는 오류로 전파되고 대상 API로 전달되지 않는다. [AccessTokenFilter.java](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/blob/5418ab565ea7f9207dc2a7e9a17faa7ea70a4b01/src/main/java/io/github/parkwoong/tokenfilter/AccessTokenFilter.java#L65-L109) |
| 설정과 재현 | 외부 토큰 URL은 HTTPS를 요구하고, HTTP는 로컬 예제에 허용한다. TTL과 URL, 자격 증명을 외부 설정에서 주입한다. JUnit 테스트는 가짜 Redis와 HTTP 전송을 사용해 캐시 히트·미스, Bearer 헤더, 발급·저장 실패, 외부 HTTP 차단을 검증하도록 작성되어 있다. [AccessTokenFilter.java](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/blob/5418ab565ea7f9207dc2a7e9a17faa7ea70a4b01/src/main/java/io/github/parkwoong/tokenfilter/AccessTokenFilter.java#L36-L54), [AccessTokenFilterTest.java](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/blob/5418ab565ea7f9207dc2a7e9a17faa7ea70a4b01/src/test/java/io/github/parkwoong/tokenfilter/AccessTokenFilterTest.java#L57-L112) |
| 변경 이력 | [`511d216`](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/commit/511d216c15b0af5589da51637695f8d78fcc47e9)에서 코드와 테스트를 추가했고, [`2587886`](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/commit/2587886d47b6c3aac4a3890f8d4050cf2d6dac91)과 [`5418ab5`](https://github.com/ParkWoong/spring-webclient-redis-token-filter-test/commit/5418ab565ea7f9207dc2a7e9a17faa7ea70a4b01)에서 사용 예제를 보강했다. |

캐시 히트 경로가 발급 요청을 건너뛴다는 점은 테스트 코드에서도 확인된다. 동시 미스를 합치는 동작은 구현되어 있지 않다. TTL은 설정값이며 토큰 응답의 실제 만료 시간에서 계산하지 않는다. 인증 서버 부하와 응답 지연의 전후 개선 폭은 측정 자료가 필요하다.

2026-11-24에 JDK 17로 원본의 `mvn test`를 실행했고 단위 테스트 5개가 통과했다. 빌드 설정의 Java 대상 버전은 8이다.

## 확인이 필요한 질문

1. 두 프로젝트 각각에서 직접 맡은 설계, 구현, 테스트 범위는 무엇인가요? 공동 작업 또는 AI 도구 지원을 어떤 범위로 표시하면 정확한가요?
2. Binance의 OkHttp·TA4J와 토큰 예제의 Reactive Redis를 선택할 때 비교한 대안이나 실제 제약이 있었나요?
3. 중복 봉, WebSocket 끊김, 토큰 재발급 또는 캐시 장애를 실제로 재현한 적이 있나요? 당시 증상과 검증 자료 중 공개 가능한 내용이 있나요?
4. 지연시간, 발급 호출량, 오류율을 전후로 측정한 기록이 있나요? 있다면 실험 환경, 조건, 수치의 공개 가능 범위는 어디까지인가요?
