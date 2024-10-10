import * as THREE from './three.module.js';

export function createPoint(color = 0xff0000, size = 1) {
  // Create a geometry for the point
  const ptGeom = new THREE.BufferGeometry();
  const vertices = new Float32Array([0, 0, 0]); // Point position at origin
  ptGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  // Create a material for the point
  const ptMtrl = new THREE.PointsMaterial({ color: color, size: size });

  // Create the point mesh
  const point = new THREE.Points(ptGeom, ptMtrl);

  return point;
}

export function createLine(points, color = 0x00ff00) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: color });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(lineGeometry, lineMaterial);

  return line;
}

export function createSphere(radius, ws = 16, hs = 16) {
  // Create a sphere geometry (radius, width segments, height segments)
  const geometry = new THREE.SphereGeometry(radius, ws, hs);

  // Create a basic material and set its color
  const material = new THREE.MeshBasicMaterial({
    color: 0x0077ff,
    wireframe: true,
  });

  // Combine geometry and material into a mesh
  const sphere = new THREE.Mesh(geometry, material);

  return sphere;
}


// 구와 직선의 교차점 계산 함수
export function findIntersection(sphereCenter, sphereRadius, rayOrigin, rayDirection) {
  // 벡터 계산: 직선의 시작점과 구의 중심 간의 벡터
  const oc = new THREE.Vector3().subVectors(rayOrigin, sphereCenter);

  // 이차 방정식의 계수 계산
  // 길이가 1인 방향벡터의 내적은 1
  const a = rayDirection.dot(rayDirection);

  // u dot o1 - o2 * 2
  const b = 2 * oc.dot(rayDirection);
  const c = oc.dot(oc) - sphereRadius * sphereRadius;

  // 판별식 계산
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    // 판별식이 음수면 교차점이 없음
    console.log('교차점 없음');
    return [];
  } else {
    // 판별식이 0 이상이면 교차점이 존재
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

    // 교차점 좌표 계산
    const intersection1 = new THREE.Vector3().addVectors(
      rayOrigin,
      rayDirection.clone().multiplyScalar(t1)
    );
    const intersection2 = new THREE.Vector3().addVectors(
      rayOrigin,
      rayDirection.clone().multiplyScalar(t2)
    );

    console.log('교차점 1:', intersection1);
    console.log('교차점 2:', intersection2);

    return [intersection1, intersection2];
  }
}
