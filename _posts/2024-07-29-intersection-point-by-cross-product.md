---
title: 공간에서 직선과 직선의 교차점(1)
description: 벡터 외적의 성질을 이용해 교차점을 구해보자
author: mark
categories: [mathmatic, geometry]
tags: [three.js]
math: true
mermaid: true
---

## 내적의 성질

- 교환 법칙(Commutative Law)

$$ \vec a \cdot \vec b = \vec b \cdot \vec a $$

- 동일한 두 벡터의 내적

$$ \vec a \cdot \vec a = a_1a_1 + a_2a_2 = a_1^2 + a_2^2 = (\sqrt{a_1^2 + a_2^2})^2 = \|\mathbf{a}\|^2 $$

<br>

## 외적의 성질

- 반교환 법칙(Anti-commutative Law)

$$ a \times b = -(b \times a) $$

- 분배 법칙(Distributive Law)

$$ a \times (b + c) = (a \times b) + (a \times c) $$

$$ (a + b) \times c = (a \times c) + (b \times c) $$

- 상수항과 결합 법칙

$$ k(a \times b) = (ka) \times b = a \times (kb) $$

- 동일한 두 벡터의 외적

$$ \vec a \times \vec a = 0 $$

<br>

## 스칼라 삼중곱

$$ \vec a \cdot (\vec b \times \vec c) = (\vec a \times \vec b) \cdot \vec c = det( \vec a, \vec b, \vec c) $$

<br>

## 직선의 교점 방정식 유도

![eq2](/assets/posts/20240730/image.png)

3차원 공간에서 두 직선은 정확한 교차점을 지나지 않는다. 대신 두 직선의 최단경로($H$)의 중점을 구하여 교차점을 근사한다.

<br>

### 두 직선의 벡터 방정식

$$ 
\begin{align}
\mathbf{F} &= \mathbf{P} + \lambda \vec r \\
\mathbf{G} &= \mathbf{Q} + \mu \vec s
\end{align}
$$

$$
\begin{align}
\mathbf{F} &= \mathbf{G} \\
\mathbf{P} + \lambda \vec r &= \mathbf{Q} + \mu \vec s \\
\end{align}
$$

$\lambda \vec r$과 $ \mu \vec s $ 으로 정리

$$
\begin{align}
\lambda \vec r &= \mathbf{Q} - \mathbf{F} + \mu \vec s \\
\mu \vec s &= \mathbf{F} - \mathbf{Q} + \lambda \vec r
\end{align}
$$

<br>

먼저 $ \lambda $를 구하기 위해 $ \lambda \vec r = \mathbf{Q} - \mathbf{F} + \mu \vec s $ 식을 전개한다.  
오른쪽에 $\mu \vec s$ 항을 제거하기 위해 양변에 $\vec s$ 으로 외적을 취한다.

$$ 
\begin{align}
\lambda \vec r \times \vec s &= (\mathbf{Q} - \mathbf{F} + \mu \vec s) \times \vec s \\
\lambda \vec r \times \vec s &= \mathbf{Q} \times \vec s - \mathbf{F} \times \vec s + \mu \vec s \times \vec s
\end{align}
$$

<br>

분배 법칙에 의해 $ \mathbf{Q} \times \vec s - \mathbf{F} \times \vec s = (\mathbf{Q} - \mathbf{F}) \times \vec s $    
결합 법칙에 의해 $ \vec s + \mu \vec s \times \vec s  = \mu (\vec s \times \vec s) $

$$
\begin{align}
\lambda \vec r \times \vec s &= (\mathbf{Q} - \mathbf{F}) \times \vec s + \mu (\vec s \times \vec s) \\
\end{align}
$$

<br>

동일한 두 벡터의 외적은 $ \vec a \times \vec a = 0 $ $ \mu (\vec s \times \vec s) = 0 $  
$\lambda \vec r \times \vec s $ 는 $\lambda$ 로 결합하고 $\lambda (\vec r \times \vec s) $
양변에 $ (\vec r \times \vec s) $ 를 내적한다.

$$
\begin{align}
\lambda(\vec r \times \vec s) &= (\mathbf{Q} - \mathbf{F}) \times \vec s + 0\\
\lambda(\vec r \times \vec s) &= (\mathbf{Q} - \mathbf{F}) \times \vec s \\
\lambda(\vec r \times \vec s) \cdot (\vec r \times \vec s) &= ((\mathbf{Q} - \mathbf{F}) \times \vec s) \cdot (\vec r \times \vec s) \\
\end{align}
$$

<br>

$ \lambda $ 를 구하기 위해 스칼라 삼중곱을 이용한다.  
$ \vec a = (\mathbf{Q} - \mathbf{F}) $, $ \vec b = \vec s $, $ \vec c = (\vec r \times \vec s) $  
$ (\vec a \times \vec b) \cdot \vec c = ((\mathbf{Q} - \mathbf{F}) \times \vec s) \cdot (\vec r \times \vec s) = det(\mathbf{Q} - \mathbf{F}, \vec s, \vec r \times \vec s) $  


$$
\begin{align}
\lambda &= {((\mathbf{Q} - \mathbf{F}) \times \vec s) \cdot (\vec r \times \vec s) \over (\vec r \times \vec s) \cdot (\vec r \times \vec s)} \\ 
\lambda &= {((\mathbf{Q} - \mathbf{F}) \times \vec s) \cdot (\vec r \times \vec s) \over \| \vec r \times \vec s \|^2 } \\ 
\lambda &= {det(\mathbf{Q} - \mathbf{F}, \vec s, \vec r \times \vec s) \over \| \vec r \times \vec s \|^2 } \\ 
\end{align}
$$

<br>

같은 방법으로 $ \mu $를 구하기 위해 $ \mu \vec s = \mathbf{F} - \mathbf{Q} + \lambda \vec r $ 식을 전개한다.

$$ 
\begin{align}
\mu \vec s &= \mathbf{F} - \mathbf{Q} + \lambda \vec r \\
\mu \vec s \times \vec r &= (\mathbf{F} - \mathbf{Q} + \lambda \vec r) \times \vec r \\
\mu \vec s \times \vec r &= \mathbf{F} \times \vec r - \mathbf{Q} \times \vec r + \lambda \vec r \times \vec r \\
\mu \vec s \times \vec r &= (\mathbf{F} - \mathbf{Q}) \times \vec r + \mu (\vec r \times \vec r) \\
\mu(\vec s \times \vec r) &= (\mathbf{F} - \mathbf{Q}) \times \vec r \\
\mu(\vec s \times \vec r) \cdot (\vec s \times \vec r) &= ((\mathbf{F} - \mathbf{Q}) \times \vec r) \cdot (\vec s \times \vec r) \\ 
\mu &= {((\mathbf{F} - \mathbf{Q}) \times \vec r) \cdot (\vec s \times \vec r) \over (\vec s \times \vec r) \cdot (\vec s \times \vec r)} \\ 
\mu &= {((\mathbf{F} - \mathbf{Q}) \times \vec r) \cdot (\vec s \times \vec r) \over \| \vec s \times \vec r \|^2 } \\ 
\mu &= {det(\mathbf{F} - \mathbf{Q}, \vec r, \vec s \times \vec r) \over \| \vec s \times \vec r \|^2 } \\ 
\end{align}
$$

$ \lambda, \mu $ =

$$
\begin{align}
\lambda &= {det(\mathbf{Q} - \mathbf{F}, \vec s, \vec r \times \vec s) \over \| \vec r \times \vec s \|^2 } \\ 
\end{align}
$$

$$
\begin{align}
\mu &= {det(\mathbf{F} - \mathbf{Q}, \vec r, \vec s \times \vec r) \over \| \vec s \times \vec r \|^2 } \\ 
\end{align}
$$

분모 $ \| \vec r \times \vec s \|^2 $와 $ \| \vec s \times \vec r \|^2 $ 이 0과 같으면 두 직선은 평행하다.

<br>

## 예제

[Three.js](https://threejs.org/) 를 이용해 두 직선의 교차점을 근사하는 코드

### 실행 결과

<div class='threejs'>
    <div id='canvas'></div>
</div>

<!-- code -->
<link rel="stylesheet" href="/assets/three/style.css">
<script type="module" src='/assets/posts/2024-07-29-interseciton-point.js'></script>
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
  const direction1 = new THREE.Vector3(1, 0, -1.4);
  direction1.sub(origin1);
  direction1.normalize();
  drawLine(origin1, direction1, 10, scene, 0xaaaa00);

  // 직선 2
  const origin2 = new THREE.Vector3(5, 5, 2);
  const direction2 = new THREE.Vector3(0, 0, -2);
  direction2.sub(origin2);
  direction2.normalize();
  drawLine(origin2, direction2, 10, scene, 0x00ffbb);

  // 교차점 근사
  const intersectionPt = approximationIntersectionPoint(origin1, direction1, origin2, direction2);
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

// 스케일러 값 구하기
// ((Q-P) x s)*(r x s) = det(Q-F, s, (r x s))
function _calcScalar(P, r, Q, s) {
  //
  const a = Q.clone().sub(P);
  // s
  const b = s.clone();
  // r x s
  const c = r.clone().cross(s);
  // determinant of the matrix
  const mat = new THREE.Matrix3(
    a.x, a.y, a.z,
    b.x, b.y, b.z,
    c.x, c.y, c.z
  );
  const detmnt = mat.determinant();

  // denomitor
  const lengthSquared = c.lengthSq();

  // the two lines are parallel
  if (lengthSquared === 0)
    return null;

  return detmnt / lengthSquared;
}

// 교차점 근사하기
function approximationIntersectionPoint(P, r, Q, s) {
  // 람다 구하기
  const lambda = _calcScalar(P, r, Q, s);
  if (lambda === null)
    return null;

  // 뮤 구하기
  const mu = _calcScalar(Q, s, P, r);

  // null 이면 두 직선은 평행
  if (mu === null)
    return null;

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
