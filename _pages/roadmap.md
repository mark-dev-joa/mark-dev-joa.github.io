---
layout: page
permalink: /roadmap/
title: 학습 로드맵
description: 기초 수학에서 컴퓨터 비전, 로보틱스까지의 학습 로드맵
nav: true
nav_order: 2
---

> 기초 수학부터 컴퓨터 비전, 로보틱스까지의 학습 로드맵.
>
> 미적분에서 출발해 선형대수, 비선형 최적화, MLE 를 거쳐 로봇팔 IK 까지 다룬다.

## 시리즈 구조

### 📐 Part 0: 수학 기초

미적분, 선형대수, 기하의 기본 도구.

- [자연상수 e](/blog/2025/eulers-number-e/)
- [테일러 급수 (Taylor Series)](/math/taylor/)
- [연쇄법칙 (Chain Rule)](/blog/2025/chain-rule/)
- [벡터의 외적 (Cross Product)](/blog/2024/cross-product/)
- [동차좌표에서의 외적](/blog/2024/cross-product-in-homogeneous-coords/)
- [평면의 방정식](/blog/2024/equations-of-planes/)
- [직선의 방정식](/blog/2019/equations-of-lines/)
- [도함수, 그라디언트, 자코비안](/blog/2026/derivative-gradient-jacobian/)

### 🔧 Part 1: 1D 최적화 기초

미분 = 0 조건에서 비선형 최소제곱까지의 최적화 알고리즘.

- [최적화 이론 기초](/blog/2026/basic-optimization/)
- [Part 1·1 선형 최소제곱과 정규방정식](/blog/2026/three-lines-visualization/)
- [Part 1·2 비선형 최소제곱](/blog/2026/nonlinear-fitting-1d/)

### 🎲 Part 1.5: 확률 입문

MLE 에 필요한 확률 기초 — PMF/PDF, 가우시안, 조건부, 베이즈.

- [Part 1·5 확률 입문](/blog/2026/probability-basics/)
- [부록 확률 분포 개관](/blog/2026/distributions-overview/)

---

### 🎯 Part 2: MLE 통일 시점

손실 함수를 확률 모델의 최대우도추정으로 해석한다.

- [Part 2·1 최대우도추정 (MLE)](/blog/2026/mle-basics/)
- [Part 2·2 MLE = SSE 의 동치성](/blog/2026/mle-sse-1d-walkthrough/)
- [Part 2·3 가중 최소제곱 (WLS)](/blog/2026/wls-basics/)
- [Part 2·4 베이즈 정리](/blog/2026/bayes-theorem/)
- [Part 2·5 MAP](/blog/2026/map-basics/)
- [에러와 자코비안 정리](/blog/2026/errors-and-jacobians/)
- MSE / Cross-entropy 와 ML 위계 *(예정)*

### 🎬 Part 3: 컴퓨터 비전 응용

기하와 최적화의 컴퓨터 비전 응용.

- [핀홀 카메라 캘리브레이션](/blog/2024/pinhole-camera/)
- [Optical Flow](/blog/2024/optical-flow/)
- [공간에서 직선과 직선의 교차점 (1)](/blog/2024/intersection-point-by-cross-product/)
- [공간에서 직선과 직선의 교차점 (2)](/blog/2024/intersection-point-by-non-linear-triangulation/)
- [구와 직선의 교차](/blog/2024/intersection-ray-sphere/)
- [원과 직선의 교차](/blog/2024/intersection-line-circle/)
- [3개의 점을 이용한 원 그리기](/blog/2024/circle-by-3-points/)
- [n 개의 점을 이용한 원 그리기 (Least Squares)](/blog/2024/circle-by-n-points/)

### 🤖 Part 4: 로봇팔 IK

비선형 최적화의 로보틱스 응용.

- 2D FK/IK 직관 *(예정)*
- 3D FK + DH 파라미터 *(예정)*
- 3D IK 와 자코비안 *(예정)*

### 🚀 Part 5: 확장 (장기)

- Kalman Filter, SLAM, 번들조정 *(예정)*

---

자세한 가이드는 → [학습 로드맵 가이드 글](/blog/2026/learning-roadmap/)
