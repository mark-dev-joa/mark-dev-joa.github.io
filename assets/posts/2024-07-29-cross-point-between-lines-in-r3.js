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


  const origin1 = new THREE.Vector3(-5, 5, 3);
  const direction1 = new THREE.Vector3(1, 0, -1.4);
  direction1.sub(origin1);
  direction1.normalize();

  createLine(origin1, direction1, 10, scene, 0xff0000);

  // Create the second line
  const origin2 = new THREE.Vector3(5, 5, 2);
  const direction2 = new THREE.Vector3(0, 0, -2);
  direction2.sub(origin2);
  direction2.normalize();
  createLine(origin2, direction2, 10, scene, 0x00ff00);

  // const a = origin2.clone().sub(origin1);
  // const b = direction2.clone();
  // const c = direction1.clone().cross(direction2);
  // const cSquared = c.lengthSq();

  // const matS = new THREE.Matrix3(
  //   a.x, a.y, a.z,
  //   b.x, b.y, b.z,
  //   c.x, c.y, c.z
  // );

  // console.log(matS);

  // const detS = matS.determinant();

  // const s = detS / cSquared;
  // console.log(s);

  // const r1 = origin1.clone().add(direction1.multiplyScalar(s));
  // console.log(r1);

  const r1 = _findIntersectionPoint(origin1, direction1, origin2, direction2);
  let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  let material = new THREE.MeshNormalMaterial({ wireframe: true });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = r1.x;
  mesh.position.y = r1.y;
  mesh.position.z = r1.z;
  scene.add(mesh);

  const r2 = _findIntersectionPoint(origin2, direction2, origin1, direction1);
  geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  material = new THREE.MeshNormalMaterial({ wireframe: true });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = r2.x;
  mesh.position.y = r2.y;
  mesh.position.z = r2.z;
  scene.add(mesh);

  const points = [];
  points.push(r1);
  points.push(r2);

  // Create the geometry and line
  const matLine = new THREE.LineBasicMaterial({ color: 0xffffff });
  const geomLine = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geomLine, matLine);

  // Add the line to the scene
  scene.add(line);

  const cp = r1.add(r2.clone().sub(r1.clone()).multiplyScalar(0.5));
  geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = cp.x;
  mesh.position.y = cp.y;
  mesh.position.z = cp.z;
  scene.add(mesh);


  //createLine(origin1, direction1, s, scene, 0xff0000);

  //const d1 = new THREE.Vector3(2, 2, 2);
}

function _findIntersectionPoint(origin1, dir1, origin2, dir2) {
  const a = origin2.clone().sub(origin1);
  const b = dir2.clone();
  const c = dir1.clone().cross(dir2);
  const lengthSq = c.lengthSq();

  const matPt = new THREE.Matrix3(
    a.x, a.y, a.z,
    b.x, b.y, b.z,
    c.x, c.y, c.z
  );
  const detS = matPt.determinant();
  const s = detS / lengthSq;

  console.log(matPt);
  console.log(s);

  return origin1.clone().add(dir1.multiplyScalar(s));
}

function createLine(origin, direction, length, scene, color) {
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
