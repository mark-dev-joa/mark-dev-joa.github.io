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
        },{id: "post-1d-비선형-피팅-gauss-newton-newton-lm-dogleg-한판-비교",
        
          title: "1D 비선형 피팅 — Gauss-Newton, Newton, LM, Dogleg 한판 비교",
        
        description: "파라미터 1개로 비선형 최소제곱의 모든 핵심 알고리즘을 한 그래프에 시각화. 인터랙티브 데모로 수렴 / 발산 / 거꾸로 가기까지 직접 체험.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/nonlinear-fitting-1d/";
          
        },
      },{id: "post-mle-sse-우리-1d-예제로-끝까지-따라가기",
        
          title: "MLE = SSE — 우리 1D 예제로 끝까지 따라가기",
        
        description: "노이즈가 가우시안이면 MLE = SSE 최소화 — 추상 명제를 1D 데이터로 숫자까지 직접 계산해서 확인하는 worked example.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/mle-sse-1d-walkthrough/";
          
        },
      },{id: "post-mle-기초-동전-던지기부터-가우시안-노이즈까지",
        
          title: "MLE 기초 — 동전 던지기부터 가우시안 노이즈까지",
        
        description: "Maximum Likelihood Estimation 의 직관 — 동전 한 번부터 시작해 회귀의 SSE 가 어떻게 자연스럽게 도출되는지 단계별로",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/mle-basics/";
          
        },
      },{id: "post-학습-로드맵-기초부터-컴퓨터-비전-로보틱스까지",
        
          title: "학습 로드맵 — 기초부터 컴퓨터 비전, 로보틱스까지",
        
        description: "미적분, 선형대수, 비선형 최적화, MLE, 로봇팔 IK 까지 한 시리즈로 정리",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/learning-roadmap/";
          
        },
      },{id: "post-에러와-자코비안-정리-errors-and-jacobians-slam-최적화의-핵심",
        
          title: "에러와 자코비안 정리 (Errors and Jacobians) — SLAM 최적화의 핵심",
        
        description: "MLE 기반 에러 함수 유도부터 Gauss-Newton 실전 풀이까지, 실제 데이터로 한 스텝씩",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/errors-and-jacobians/";
          
        },
      },{id: "post-최적화-이론-기초-정리-gradient-descent-newton-gauss-newton-levenberg-marquardt",
        
          title: "최적화 이론 기초 정리 (Gradient Descent, Newton, Gauss-Newton, Levenberg-Marquardt)",
        
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
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
