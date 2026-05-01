---
title: 가이드 학습 로드맵
description: 미적분, 선형대수, 비선형 최적화, MLE, 로봇팔 IK 까지 한 시리즈로 정리
author: mark
categories: [math]
tags: [roadmap, series, mle, optimization, robotics]
math: true
---

# 학습 로드맵 — 기초부터 컴퓨터 비전, 로보틱스까지

> 흩어져 있던 글들을 **하나의 학습 시리즈** 로 다시 엮습니다.
> 미적분/선형대수/기하 → 비선형 최적화 → MLE → 로봇팔 IK 까지.
>
> 이 글은 시리즈의 **목차 역할**. 새 글이 발행될 때마다 업데이트됩니다.

---

## 시리즈 한 줄 요약

> "**모든 회귀/추정/IK 가 결국 MLE 의 다른 얼굴이다**" 를 직접 보여주는 시리즈.
>
> 수식 외우기보다 **직관 + 인터랙티브 데모** 로 이해.

---

## 전체 흐름

```
   수학 기초 (미적분 + 선형대수 + 기하)              
          ↓                                          
   1D 최적화 (미분=0, GD, Newton)                    
          ↓                                          
   비선형 최소제곱 (Gauss-Newton, LM, Dogleg)        
          ↓                                          
   ★ MLE — 위 모든 것의 통일 시점 ★                  
          ↓                                          
   응용:  컴퓨터 비전 (캘리브레이션, optical flow)   
          로보틱스 (FK / IK)                         
```

→ **MLE 가 척추**. 모든 응용 (회귀, 분류, IK, SLAM) 이 이 한 프레임으로 묶임.

---

## 📐 Part 0: 수학 기초

기본 도구 — 미분, 테일러, 벡터, 평면/직선.

| 글 | 한 줄 |
|---|---|
| [자연상수 e](/blog/2025/eulers-number-e/) | 왜 미분/적분에서 $e$ 가 자연스러운지 |
| [테일러 급수](/math/taylor/) | 함수를 다항식으로 근사하는 도구 |
| [연쇄법칙](/blog/2025/chain-rule/) | 합성함수 미분의 기본 규칙 |
| [벡터의 외적](/blog/2024/cross-product/) | 3D 벡터 연산 + 평면의 법선 |
| [동차좌표에서의 외적](/blog/2024/cross-product-in-homogeneous-coords/) | 컴퓨터 비전의 기본 |
| [평면의 방정식](/blog/2024/equations-of-planes/) | 외적의 첫 응용 |
| [직선의 방정식](/blog/2019/equations-of-lines/) | 직선/평면 기하 |

---

## 🔧 Part 1: 1D 최적화 기초

미분 = 0 직관에서 출발 → 비선형 최소제곱 → 알고리즘 한판 비교.

| # | 글 | 상태 |
|---|---|---|
| 0 | [Part 1·1 선형 최소제곱과 정규방정식](/blog/2026/three-lines-visualization/) — 선형 LSE 입문 (Ax=b → 정규방정식) | ✓ 발행 |
| 1 | [최적화 이론 기초](/blog/2026/basic-optimization/) — GD, Newton, GN, LM 카탈로그 | ✓ 발행 |
| 2 | [에러와 자코비안 정리](/blog/2026/errors-and-jacobians/) — SLAM 시점 MLE + GN 실전 | ✓ 발행 |
| 3 | 1D 비선형 피팅 — Gauss-Newton 끝까지 | 🔜 예정 |
| 4 | LM, Newton, Dogleg 한판 비교 | 🔜 예정 |

---

## 🎯 Part 2: MLE 통일 시점 ⭐

확률적 시점에서 보면 **모든 손실 함수가 한 뿌리** — MLE 의 자연스러운 도출.

| # | 글 | 상태 |
|---|---|---|
| 5+6 | [Part 2·1 최대우도추정(MLE) — 동전과 가우시안](/blog/2026/mle-basics/) | ✓ 발행 |
| 7 | [Part 2·2 MLE = SSE 의 동치성 — 1D 회귀 검증](/blog/2026/mle-sse-1d-walkthrough/) | ✓ 발행 |
| 8 | MSE / Cross-entropy 와 ML 위계 | 🔜 예정 |
| 9 | [Part 2·3 가중 최소제곱 (WLS) — 점마다 다른 노이즈](/blog/2026/wls-basics/) | ✓ 발행 |

> **이 Part 의 한 등식**:
>
> $$\ell(w) = C - \frac{\text{SSE}(w)}{2\sigma^2}$$
>
> "확률 (likelihood) 시점 ↔ 손실 (SSE) 시점" 을 잇는 다리. ★

---

## 🎬 Part 3: 컴퓨터 비전 응용

Part 1, 2 의 도구를 비전 문제에 적용.

| 글 |
|---|
| [핀홀 카메라 캘리브레이션](/blog/2024/pinhole-camera/) |
| [Optical Flow](/blog/2024/optical-flow/) |
| [공간에서 직선과 직선의 교차점 (1)](/blog/2024/intersection-point-by-cross-product/) |
| [공간에서 직선과 직선의 교차점 (2) — Triangulation](/blog/2024/intersection-point-by-non-linear-triangulation/) |
| [구와 직선의 교차](/blog/2024/intersection-ray-sphere/) |
| [원과 직선의 교차](/blog/2024/intersection-line-circle/) |
| [3개의 점을 이용한 원 그리기](/blog/2024/circle-by-3-points/) |
| [n 개의 점을 이용한 원 그리기 (Least Squares)](/blog/2024/circle-by-n-points/) |

---

## 🤖 Part 4: 로봇팔 IK

비선형 최적화 + MLE 의 로보틱스 응용. **OpenMANIPULATOR-X** (4DOF) 기준.

| # | 글 | 상태 |
|---|---|---|
| 9 | 2D FK/IK 직관 | 🔜 예정 |
| 10 | 3D FK + DH 파라미터 | 🔜 예정 |
| 11 | 3D IK 와 자코비안 | 🔜 예정 |

---

## 🚀 Part 5: 확장 (장기)

| # | 글 | 메모 |
|---|---|---|
| ~~12~~ | ~~WLS — 가중 SSE~~ (Part 2·3 으로 발행됨) | — |
| 13 | MAP / Regularization | **LM 의 $\lambda$ 정체 밝히기** ★ |
| 14 | Kalman Filter 입문 | 시간 변하는 추정 |
| 15 | SLAM / 번들조정 | 대규모 비선형 최적화 |

---

## 한 줄 정리

> **수학 기초 → 최적화 → MLE → 응용** 의 흐름.
>
> 한 편씩 발행될 때마다 이 인덱스가 갱신됩니다.

새 글이 추가되면 메뉴의 **학습 로드맵** 탭에서 항상 최신 목록 확인 가능.
