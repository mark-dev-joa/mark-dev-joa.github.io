---
title: 공간에서 직선과 직선의 교차점(2)
description: 비선형 삼각측량법을 이용해 교차점을 구해보자
author: mark
categories: [mathmatic, geometry, mvg]
tags: [three.js]
pin: true
math: true
mermaid: true
---

## 비선형 근사 방식의 삼각측량법

![eq2](/assets/posts/20240730/image.png)

3차원 공간에서 두 직선은 정확한 교차점을 지나지 않는다. 대신 두 직선의 최단 경로($H$)의 중점을 구하여 교차점을 근사한다.

<br>

### 두 직선의 벡터 방정식

$$ 
\begin{align}
\mathbf{F} &= \mathbf{P} + \lambda \vec r \\
\mathbf{G} &= \mathbf{Q} + \mu \vec s
\end{align}
$$

<br>

#### 최단 경로를 나타내는 벡터 $ \vec h $ 는 방향 벡터 $ \vec r $ 과 $ \vec s $ 의 수직

$$
\begin{align}
(G - F) \cdot \vec r = 0 \\
(F - G) \cdot \vec s = 0 \\
\end{align}
$$

<br>

#### 두 개의 수식을 연립

$$
\begin{align}
((Q + \mu \vec s) - (P + \lambda \vec r)) \cdot \vec r = 0\\
((P + \lambda \vec r) - (Q + \mu \vec s)) \cdot \vec s = 0\\
\end{align}
$$

$$
\begin{align}
(Q + \mu \vec s - P - \lambda \vec r) \cdot \vec r = 0\\
(P + \lambda \vec r - Q - \mu \vec s) \cdot \vec s = 0\\
\end{align}
$$

$$
\begin{align}
(P + \lambda \vec r - Q - \mu \vec s) \cdot \vec r = 0\\
(P + \lambda \vec r - Q - \mu \vec s) \cdot \vec s = 0\\
\end{align}
$$

<br>

#### $ \lambda $ 와 $ \mu $ 에 대한 수식으로 정리

$$
\lambda =
\begin{cases}
(P + \lambda \vec r - Q - \mu \vec s)^T \vec r &= 0 \\
P^T \vec r + \lambda \vec r^T \vec r - Q^T \vec r - \mu \vec s^T \vec r &= 0 \\
\lambda \vec r^T \vec r - \mu \vec s^T \vec r + P^T \vec r - Q^T \vec r &= 0 \\
\lambda \vec r^T \vec r - \mu \vec s^T \vec r &= Q^T \vec r - P^T \vec r \\
\lambda \vec r^T \vec r - \mu \vec s^T \vec r &= (Q - P)^T\vec r \\
\end{cases}
$$

$$
\mu =
\begin{cases}
(P + \lambda \vec r - Q - \mu \vec s)^T \vec s &= 0\\
P^T \vec s + \lambda \vec r^T \vec s - Q^T \vec s - \mu \vec s^T \vec s &= 0 \\
\lambda \vec r^T \vec s - \mu \vec s^T \vec s + P^T \vec s - Q^T \vec s &= 0 \\
\lambda \vec r^T \vec s - \mu \vec s^T \vec s &= Q^T \vec s - P^T \vec s \\
\lambda \vec r^T \vec s - \mu \vec s^T \vec s &= (Q - P)^T\vec s \\
\end{cases}
$$

<br>

#### $ \mathbf{A}x = b $ 의 행렬 형태로 정리

$$
\begin{align}
\lambda \vec r^T \vec r - \mu \vec s^T \vec r &= (Q - P)^T\vec r \\
\lambda \vec r^T \vec s - \mu \vec s^T \vec s &= (Q - P)^T\vec s \\
\end{align}
$$

$$
\begin{bmatrix}
\vec r^T \vec r & - \vec s^T \vec r \\ 
\vec r^s \vec r & - \vec s^T \vec s
\end{bmatrix}
\begin{bmatrix}
\lambda \\ 
\mu
\end{bmatrix}
=
\begin{bmatrix}
(Q - P)^T\vec r \\ 
(Q - P)^T\vec s
\end{bmatrix}
$$



## 예제

[Three.js](https://threejs.org/) 를 이용해 두 직선의 교차점을 근사하는 코드

### 실행 결과

<div class='threejs'>
    <div id='canvas'></div>
</div>

<!-- code -->
<link rel="stylesheet" href="/assets/three/style.css">
<script type="module" src='/assets/posts/2024-07-30-non-linear-triangulation.js'></script>
<br>

### 구현 코드

```javascript

import * as THREE from '/assets/three/three.module.js';
import { OrbitControls } from "/assets/three/OrbitControls.js";

var container = document.getElementById("canvas");
var scene, camera, controls, renderer;

init();
animate();

function init() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // grid helper
  const size = 20;
  const divisions = 20;
  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  // axes
  const axes = new THREE.AxesHelper(5);
  scene.add(axes);

  // camera
  camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
  camera.position.x = 0;
  camera.position.z = 10;
  camera.position.y = 10;
  const target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(target);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // camera controls
  controls = new OrbitControls(camera, renderer.domElement);

  // 직선 1
  const origin1 = new THREE.Vector3(-5, 5, 3);
  const direction1 = new THREE.Vector3(1, 0, 1.4);
  direction1.sub(origin1);
  direction1.normalize();
  drawLine(origin1, direction1, 10, scene, 0xff0000);

  // 직선 2
  const origin2 = new THREE.Vector3(5, 5, 2);
  const direction2 = new THREE.Vector3(1, 0, 0);
  direction2.sub(origin2);
  direction2.normalize();
  drawLine(origin2, direction2, 10, scene, 0x00ffbb);

  // 교차점 근사
  const intersectionPt = Triangulation(origin1, direction1, origin2, direction2);
  console.log(intersectionPt);

  if (intersectionPt === null)
    return;

  // 교차점에 네모 출력
  let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  let material = new THREE.MeshNormalMaterial({ wireframe: true });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = intersectionPt.h.x;
  mesh.position.y = intersectionPt.h.y;
  mesh.position.z = intersectionPt.h.z;
  scene.add(mesh);

  // f, g 포인트 선으로 연결
  const points = [];
  points.push(intersectionPt.f);
  points.push(intersectionPt.g);

  const matLine = new THREE.LineBasicMaterial({ color: 0xffffff });
  const geomLine = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geomLine, matLine);
  scene.add(line);

  // f와 g를 연결하는 h 벡터
  const vh = intersectionPt.f.clone().sub(intersectionPt.g);
  // r과 수직인지 확인
  let theta = direction1.clone().normalize().dot(vh.normalize());
  console.log(Math.acos(theta) * 180 / Math.PI);

  // s와 수직인지 확인
  theta = direction2.clone().normalize().dot(vh.normalize());
  console.log(Math.acos(theta) * 180 / Math.PI);
}

function Triangulation(P, r, Q, s) {
  // A matrix
  const a11 = r.clone().dot(r);
  const a12 = -s.clone().dot(r);
  const a21 = r.clone().dot(s);
  const a22 = -s.clone().dot(s);

  // inverse matrix
  const invD = 1 / (a11 * a22 - a12 * a21);
  const invA11 = a22 * invD;
  const invA12 = -a12 * invD;
  const invA21 = -a21 * invD;
  const invA22 = a11 * invD;

  // distance
  const distance = Q.clone().sub(P.clone());

  // b
  const b1 = r.clone().dot(distance);
  const b2 = s.clone().dot(distance);

  // solution x = invA * b
  const lambda = invA11 * b1 + invA12 * b2;
  const mu = invA21 * b1 + invA22 * b2;

  // f와 g 구하기
  const f = P.add(r.multiplyScalar(lambda));
  const g = Q.add(s.multiplyScalar(mu));

  // h 직선의 중점
  // h = (g + f) / 2 = (g+f) * 0.5
  return { h: g.clone().add(f).multiplyScalar(0.5), f, g };
}


//
function drawLine(origin, direction, length, scene, color) {
  // Normalize the direction vector
  direction.normalize();

  // Create line material
  const matLine = new THREE.LineBasicMaterial({ color: color });

  // Create points for the line
  const points = [];
  points.push(new THREE.Vector3(
    origin.x + direction.x * -length,
    origin.y + direction.y * -length,
    origin.z + direction.z * -length
  ));
  points.push(new THREE.Vector3(
    origin.x + direction.x * length,
    origin.y + direction.y * length,
    origin.z + direction.z * length
  ));

  // Create the geometry and line
  const geomLine = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geomLine, matLine);

  // Add the line to the scene
  scene.add(line);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

```

## Reference

[[오다기리 박의 알고리즘 노트] 직선과 직선의 교차점 구하기](https://wjdgh283.tistory.com/entry/%EC%A7%81%EC%84%A0%EA%B3%BC-%EC%A7%81%EC%84%A0%EC%9D%98-%EA%B5%90%EC%B0%A8%EC%A0%90-%EA%B5%AC%ED%95%98%EA%B8%B0)  
[[jebae's dev blog] 벡터의 외적과 삼중곱](https://jebae.github.io/vector-cross-product)
