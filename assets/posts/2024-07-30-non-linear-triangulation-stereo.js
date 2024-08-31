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
  const size = 2000;
  const divisions = 2000;
  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  // axes
  const axes = new THREE.AxesHelper(5);
  scene.add(axes);

  // camera
  camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);


  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // camera controls
  controls = new OrbitControls(camera, renderer.domElement);

  const matR1 = new THREE.Matrix4(
    0.962753, 0.197778, -0.184364, 0,
    -0.019011, -0.630664, -0.775823, 0,
    -0.269713, 0.750431, -0.603414, 0,
    0, 0, 0, 1
  );

  const x = -(0.962753 * -226.609948) - (-0.019011 * -85.524850) - (-0.269713 * 795.187926);
  const y = -(0.197778 * -226.609948) - (-0.630664 * -85.524850) - (0.750431 * 795.187926);
  const z = -(-0.184364 * -226.609948) - (-0.775823 * -85.524850) - (-0.603414 * 795.187926);
  console.log(x, y, z);

  matR1.transpose();

  const matT1 = new THREE.Matrix4(
    1, 0, 0, 226.609948,
    0, 1, 0, 85.524850,
    0, 0, 1, -795.187926,
    0, 0, 0, 1
  );

  const matK1 = matR1.clone().multiply(matT1);
  console.log(matK1);

  // const matS0 = new THREE.Matrix4(
  //   0.962753, 0.197778, -0.184364, 0,
  //   -0.019011, -0.630664, -0.775823, 0,
  //   -0.269713, 0.750431, -0.603414, 0,
  //   0, 0, 0, 1
  // );
  // console.log(matS0);

  // const matS0T = matS0.clone().transpose();
  // matS0T.setPosition(226.609948 / 10, 85.524850 / 10, -795.187926 / 10);



  //console.log(matS0T);

  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshNormalMaterial();
  let mesh = new THREE.Mesh(geometry, material);
  mesh.applyMatrix4(matK1);
  scene.add(mesh);

  let direction = new THREE.Vector3;
  mesh.getWorldDirection(direction);
  console.log(direction);
  drawLine(mesh.position.clone(), mesh.position.clone().add(direction.clone().multiplyScalar(10)), scene, 0xff00ff);

  camera.position.x = mesh.position.x;
  camera.position.y = mesh.position.y;
  camera.position.z = mesh.position.z;
  camera.lookAt(new THREE.Vector3(0, 0, 0));


  // const matS1 = new THREE.Matrix4(
  //   0.988195, 0.094108, -0.120891, -223.916608 / 10,
  //   -0.033342, -0.638073, -0.769254, -86.927169 / 10,
  //   -0.149530, 0.764204, -0.627402, 744.259051 / 10,
  //   0, 0, 0, 1
  // );
  // matS1.invert();

  // geometry = new THREE.BoxGeometry(1, 1, 1);
  // material = new THREE.MeshNormalMaterial();
  // mesh = new THREE.Mesh(geometry, material);
  // mesh.applyMatrix4(matS1);
  // scene.add(mesh);

  // mesh.getWorldDirection(direction);
  // console.log(direction);
  // drawLine(mesh.position.clone(), mesh.position.clone().add(direction.clone().multiplyScalar(10)), scene, 0xffff00);


  // const direction = new THREE.Vector3;
  // mesh.getWorldDirection(direction);
  // console.log(direction);

  // drawLine(origin1, origin1.clone().add(direction.clone().multiplyScalar(5)), scene, 0xff00ff);

  // const pos = origin1.clone().add(direction.clone().multiplyScalar(5));
  // //const pos = origin1.clone();
  // camera.position.x = pos.x;
  // camera.position.y = pos.y;
  // camera.position.z = pos.z;

  // const target = new THREE.Vector3(0, 0, 0);
  // camera.lookAt(origin1);

  // // 카메라 1
  // const origin2 = new THREE.Vector3(223.916608, 86.927169, -744.259051);
  // origin2.multiplyScalar(0.1);
  // const direction2 = new THREE.Vector3(0, 0, 0);
  // drawLine(origin2, direction2, scene, 0x00ff00);
  // geometry = new THREE.BoxGeometry(1, 1, 1);
  // material = new THREE.MeshNormalMaterial();
  // mesh = new THREE.Mesh(geometry, material);
  // mesh.position.x = origin2.x;
  // mesh.position.y = origin2.y;
  // mesh.position.z = origin2.z;
  // scene.add(mesh);

  // // 카메라 C
  // const origin3 = new THREE.Vector3(102.728082, 205.642891, -972.642859);
  // origin3.multiplyScalar(0.1);

  // const direction3 = new THREE.Vector3(0, 0, 0);
  // drawLine(origin3, direction3, scene, 0x0000ff);
  // geometry = new THREE.BoxGeometry(1, 1, 1);
  // material = new THREE.MeshNormalMaterial();
  // mesh = new THREE.Mesh(geometry, material);
  // mesh.position.x = origin3.x;
  // mesh.position.y = origin3.y;
  // mesh.position.z = origin3.z;
  // scene.add(mesh);
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
function drawLine(start, end, scene, color) {
  // Create line material
  const matLine = new THREE.LineBasicMaterial({ color: color });

  // Create points for the line
  const points = [];
  points.push(start);
  points.push(end);

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
