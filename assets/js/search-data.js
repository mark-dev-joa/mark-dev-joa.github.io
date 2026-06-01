// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-소개",
    title: "소개",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-블로그",
          title: "블로그",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-학습-로드맵",
          title: "학습 로드맵",
          description: "기초부터 컴퓨터 비전, 로보틱스까지 한 시리즈로",
          section: "Navigation",
          handler: () => {
            window.location.href = "/roadmap/";
          },
        },{id: "post-도함수-그라디언트-자코비안",
        
          title: "도함수, 그라디언트, 자코비안",
        
        description: "1 차 미분이 입력과 출력의 차원에 따라 형태를 바꾸는 흐름. 도함수에서 출발해 편미분, 그라디언트, 자코비안까지 단계별로 정리하고 1 차 테일러 근사가 어떻게 일관되게 일반화되는지 본다.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/derivative-gradient-jacobian/";
          
        },
      },{id: "post-lie-이론-기초",
        
          title: "Lie 이론 기초",
        
        description: "SO(3) 와 SE(3) 위의 회전과 강체 변환을 다루는 Lie 이론 입문. Group, smooth manifold, tangent space, Lie algebra, Rodrigues 공식, exp/log map, IK/SLAM 응용, BCH 공식까지 한 cycle 정리.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/lie-theory-basics/";
          
        },
      },{id: "post-부록-확률-분포-개관",
        
          title: "부록 확률 분포 개관",
        
        description: "확률 분포의 큰 지도. 연속/이산 분류, 자주 쓰는 10 개 분포의 식·적분·평균·분산 카탈로그, Lambert W 등 비초등 함수 정리.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/distributions-overview/";
          
        },
      },{id: "post-part-1-5-확률-입문",
        
          title: "Part 1·5 확률 입문",
        
        description: "PDF/PMF, 가우시안, 곱셈/독립, 조건부, 베이즈. 적분 직관과 가우시안 적분 전개까지 — MLE 들어가기 전 확률 격차 메우기.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/probability-basics/";
          
        },
      },{id: "post-part-2-4-베이즈-정리",
        
          title: "Part 2·4 베이즈 정리",
        
        description: "조건부 확률의 정의에서 베이즈 정리를 유도하고, posterior/likelihood/prior/evidence 의 의미와 MLE/MAP 으로의 연결을 주사위 예제와 시각화로 정리.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/bayes-theorem/";
          
        },
      },{id: "post-part-2-5-map",
        
          title: "Part 2·5 MAP",
        
        description: "MLE 위에 prior 를 추가한 MAP. 가우시안 prior 가 어떻게 L2 정칙화로 자연 도출되는지, LM 의 λ 가 사실 prior 강도임을 밝히는 글. 동전 예제로 MLE vs MAP 전 과정 포함.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/map-basics/";
          
        },
      },{id: "post-part-2-3-가중-최소제곱-wls",
        
          title: "Part 2·3 가중 최소제곱 (WLS)",
        
        description: "Stage 2 의 가정 (모든 점이 같은 노이즈) 을 풀어준 자연스러운 다음 단계. 점마다 다른 σᵢ 인정하면 가중 SSE 가 자연 등장.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/wls-basics/";
          
        },
      },{id: "post-가이드-학습-로드맵",
        
          title: "가이드 학습 로드맵",
        
        description: "미적분, 선형대수, 비선형 최적화, MLE, 로봇팔 IK 까지 한 시리즈로 정리",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/learning-roadmap/";
          
        },
      },{id: "post-part-2-2-mle-sse-의-동치성",
        
          title: "Part 2·2 MLE = SSE 의 동치성",
        
        description: "노이즈가 가우시안이면 MLE = SSE 최소화 — 추상 명제를 1D 데이터로 숫자까지 직접 계산해서 확인하는 worked example.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/mle-sse-1d-walkthrough/";
          
        },
      },{id: "post-part-2-1-최대우도추정-mle",
        
          title: "Part 2·1 최대우도추정 (MLE)",
        
        description: "Maximum Likelihood Estimation 의 직관 — 동전 한 번부터 시작해 회귀의 SSE 가 어떻게 자연스럽게 도출되는지 단계별로",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/mle-basics/";
          
        },
      },{id: "post-part-1-2-비선형-최소제곱",
        
          title: "Part 1·2 비선형 최소제곱",
        
        description: "파라미터 1개로 비선형 최소제곱의 모든 핵심 알고리즘을 한 그래프에 시각화. 인터랙티브 데모로 수렴 / 발산 / 거꾸로 가기까지 직접 체험.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/nonlinear-fitting-1d/";
          
        },
      },{id: "post-part-1-1-선형-최소제곱과-정규방정식",
        
          title: "Part 1·1 선형 최소제곱과 정규방정식",
        
        description: "세 직선의 교점이 없을 때, 가장 잘 맞는 점 찾기. Ax=b 부터 정규방정식 유도까지 단계별로",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/three-lines-visualization/";
          
        },
      },{id: "post-에러와-자코비안-정리",
        
          title: "에러와 자코비안 정리",
        
        description: "MLE 기반 에러 함수 유도부터 Gauss-Newton 실전 풀이까지, 실제 데이터로 한 스텝씩",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/errors-and-jacobians/";
          
        },
      },{id: "post-최적화-이론-기초",
        
          title: "최적화 이론 기초",
        
        description: "최적화 알고리즘을 직관적으로 이해하기",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/basic-optimization/";
          
        },
      },{id: "post-자연상수-e",
        
          title: "자연상수 e",
        
        description: "기억하려고 정리하는 자연상수 e",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/eulers-number-e/";
          
        },
      },{id: "post-연쇄법칙-chain-rule-정리",
        
          title: "연쇄법칙(Chain Rule) 정리",
        
        description: "필요해서 정리하는 체인룰",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/chain-rule/";
          
        },
      },{id: "post-테일러-급수-taylor-series",
        
          title: "테일러 급수(Taylor Series)",
        
        description: "아는데로 정리하는 테일러 급수",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/math/taylor/";
          
        },
      },{id: "post-좌표평면에서-원과-직선의-교차-및-교점",
        
          title: "좌표평면에서 원과 직선의 교차 및 교점",
        
        description: "연립방정식, 이차방정식의 근의 공식, 판별식",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/intersection-line-circle/";
          
        },
      },{id: "post-공간에서-구와-직선의-교차-및-교점",
        
          title: "공간에서 구와 직선의 교차 및 교점",
        
        description: "연립방정식, 이차방정식의 근의 공식, 판별식",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/intersection-ray-sphere/";
          
        },
      },{id: "post-핀홀-카메라-캘리브레이션",
        
          title: "핀홀 카메라 캘리브레이션",
        
        description: "카메라 모델 변환 정리",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/pinhole-camera/";
          
        },
      },{id: "post-영상-픽셀을-이용해-물체-모션-추정하기",
        
          title: "영상 픽셀을 이용해 물체 모션 추정하기",
        
        description: "optical flow",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/optical-flow/";
          
        },
      },{id: "post-n-개의-점을-이용한-원-그리기",
        
          title: "n 개의 점을 이용한 원 그리기",
        
        description: "해가 존재하지 않는 선형연립방정식 Ax=b 에서 근사해 구하기",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/circle-by-n-points/";
          
        },
      },{id: "post-3개의-점을-이용한-원-그리기",
        
          title: "3개의 점을 이용한 원 그리기",
        
        description: "3개의 방정식을 연립하여 원의 방정식 구하기",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/circle-by-3-points/";
          
        },
      },{id: "post-공간에서-직선과-직선의-교차점-2",
        
          title: "공간에서 직선과 직선의 교차점(2)",
        
        description: "비선형 삼각측량법을 이용해 교차점을 구해보자",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/intersection-point-by-non-linear-triangulation/";
          
        },
      },{id: "post-공간에서-직선과-직선의-교차점-1",
        
          title: "공간에서 직선과 직선의 교차점(1)",
        
        description: "벡터 외적의 성질을 이용해 교차점을 구해보자",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/intersection-point-by-cross-product/";
          
        },
      },{id: "post-평면의-방정식-equations-of-planes",
        
          title: "평면의 방정식(equations of planes)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/equations-of-planes/";
          
        },
      },{id: "post-벡터의-외적-cross-product",
        
          title: "벡터의 외적(cross product)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cross-product/";
          
        },
      },{id: "post-cross-product-in-homogeneous-coordinates",
        
          title: "cross product in homogeneous coordinates",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cross-product-in-homogeneous-coords/";
          
        },
      },{id: "post-직선의-방정식-equations-of-lines",
        
          title: "직선의 방정식(Equations of Lines)",
        
        description: "일반 방정식, 벡터 방정식, 대칭 방정식",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/equations-of-lines/";
          
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6D%61%72%6B-%64%65%76-%6A%6F%61@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/mark-dev-joa", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },];
