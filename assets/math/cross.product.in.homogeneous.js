import * as THREE from '/assets/three/three.module.js';
import { OrbitControls } from "/assets/three/OrbitControls.js";

var camera, scene, renderer, controls;
var geometry, material, mesh;

init();
animate();

function init() {
  var container = document.getElementById("cube");
  var width = container.clientWidth;
  var height = container.clientHeight;

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  geometry = new THREE.BoxGeometry(1, 1, 1);
  material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  //create a blue LineBasicMaterial
  material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 100, 0));
  //points.push(new THREE.Vector3(10, 0, 0));

  geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  //scene.add(line);

  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  // orthgraphic camera
  camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000);
  camera.position.x = 0;
  camera.position.z = 0;
  camera.position.y = 1;

  const target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(target);

  // axes
  const axes = new THREE.AxesHelper(50);
  scene.add(axes);


  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
}

// animation
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
