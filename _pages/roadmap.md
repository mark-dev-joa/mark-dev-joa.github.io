---
layout: page
permalink: /roadmap/
title: 학습 로드맵
description: 기초부터 컴퓨터 비전, 로보틱스까지 한 시리즈로
nav: true
nav_order: 2
---

> **기초부터 컴퓨터 비전, 로보틱스까지 학습 로드맵**.
>
> 미적분 → 선형대수 → 비선형 최적화 → MLE → 로봇팔 IK 까지 차근차근.

## 시리즈 구조

### 📐 Part 0: 수학 기초

미적분, 선형대수, 기하의 기본 도구. 이후 모든 글의 토대.

- [자연상수 e](/blog/2025/eulers-number-e/)
- [테일러 급수 (Taylor Series)](/math/taylor/)
- [연쇄법칙 (Chain Rule)](/blog/2025/chain-rule/)
- [벡터의 외적 (Cross Product)](/blog/2024/cross-product/)
- [동차좌표에서의 외적](/blog/2024/cross-product-in-homogeneous-coords/)
- [평면의 방정식](/blog/2024/equations-of-planes/)
- [직선의 방정식](/blog/2019/equations-of-lines/)

### 🔧 Part 1: 1D 최적화 기초

미분 = 0 직관부터 비선형 최소제곱까지.

- [Part 1·1 선형 최소제곱과 정규방정식](/blog/2026/three-lines-visualization/) — 선형 LSE 의 기초 (Ax=b, 정규방정식)
- [최적화 이론 기초](/blog/2026/basic-optimization/) — GD, Newton, GN, LM 카탈로그
- [에러와 자코비안 정리](/blog/2026/errors-and-jacobians/) — SLAM 시점 MLE + GN 실전
- [Part 1·2 비선형 최소제곱 — 4가지 알고리즘 비교](/blog/2026/nonlinear-fitting-1d/)

### 🎲 Part 1.5: 확률 입문 (MLE 가기 전 워밍업)

확률 vs 확률 밀도, 가우시안, 곱셈 규칙, 조건부, 베이즈 — 5단계로 단숨에.

- [Part 1·5 확률 입문 — MLE 전에 알아야 할 5가지](/blog/2026/probability-basics/)
- [부록 확률 분포 개관 — 자주 쓰는 10 개 분포 카탈로그](/blog/2026/distributions-overview/)

---

### 🎯 Part 2: MLE 통일 시점

확률적 시점에서 본 손실 함수의 정체.

- [Part 2·1 최대우도추정(MLE) — 동전과 가우시안](/blog/2026/mle-basics/) ★ 편 5+6 통합
- [Part 2·2 MLE = SSE 의 동치성 — 1D 회귀 검증](/blog/2026/mle-sse-1d-walkthrough/)
- [Part 2·3 가중 최소제곱 (WLS) — 점마다 다른 노이즈 신뢰도](/blog/2026/wls-basics/) ★ Stage 3
- [Part 2·4 MAP — 사전 지식 추가, LM 의 λ 정체](/blog/2026/map-basics/) ★ Stage 4
- MSE / Cross-entropy 와 ML 위계 *(예정)*

### 🎬 Part 3: 컴퓨터 비전 응용

기하 + 최적화의 실전 응용.

- [핀홀 카메라 캘리브레이션](/blog/2024/pinhole-camera/)
- [Optical Flow](/blog/2024/optical-flow/)
- [공간에서 직선과 직선의 교차점 (1)](/blog/2024/intersection-point-by-cross-product/)
- [공간에서 직선과 직선의 교차점 (2) — Triangulation](/blog/2024/intersection-point-by-non-linear-triangulation/)
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

- WLS — 가중 SSE *(예정)*
- MAP / Regularization — LM 의 λ 정체 *(예정)*
- Kalman Filter, SLAM, 번들조정 *(예정)*

---

자세한 가이드는 → [학습 로드맵 가이드 글](/blog/2026/learning-roadmap/)
