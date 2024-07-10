var camera, scene, renderer;
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

  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  // camera
  camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 2;
  camera.position.y = 4;

  const target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(target);


  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
}

// animation
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
