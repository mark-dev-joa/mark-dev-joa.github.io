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
